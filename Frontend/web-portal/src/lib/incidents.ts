
'use server';

import { formatDistanceToNow } from 'date-fns';
import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';
import { getContacts } from './contacts';

export interface Incident {
  _id: ObjectId;
  id: string;
  type: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  createdAt: Date;
  status: 'Reported' | 'In Progress' | 'Resolved';
  location: string;
  image?: string;
  userId?: string;
  isSos?: boolean;
}

export type IncidentSerializable = Omit<Incident, '_id' | 'createdAt'> & {
  _id: string;
  createdAt: string;
  timestamp: string;
};

let client: MongoClient;
let db: Db;
let incidents: Collection<Incident>;

async function getIncidentsCollection(): Promise<Collection<Incident>> {
  if (incidents) return incidents;
  client = await clientPromise;
  db = client.db();
  incidents = db.collection<Incident>('incidents');
  return incidents;
}


function serializeIncident(incident: Incident): IncidentSerializable {
  return {
    ...incident,
    _id: incident._id.toString(),
    id: incident._id.toString(),
    timestamp: formatDistanceToNow(incident.createdAt, { addSuffix: true }),
    createdAt: incident.createdAt.toISOString(),
  };
}

export async function getIncidents(): Promise<IncidentSerializable[]> {
  const incidentsCollection = await getIncidentsCollection();
  const allIncidents = await incidentsCollection.find({}).sort({ createdAt: -1 }).toArray();
  return allIncidents.map(serializeIncident);
}

export async function getIncidentsForUser(userId: string = '1'): Promise<IncidentSerializable[]> {
    const incidentsCollection = await getIncidentsCollection();
    const userIncidents = await incidentsCollection.find({ userId: userId }).sort({ createdAt: -1 }).toArray();
    return userIncidents.map(serializeIncident);
}

export async function addIncident(newIncidentData: {
    type: string;
    severity: string;
    description: string;
    location: string;
    image?: string;
    userId?: string;
    isSos?: boolean;
}): Promise<IncidentSerializable> {
    const incidentsCollection = await getIncidentsCollection();
    const userId = newIncidentData.userId || '1'; // Default to user '1' if not provided

    if (newIncidentData.isSos) {
        const contacts = await getContacts(userId);
        if (contacts.length > 0) {
            console.log(`SOS TRIGGERED: Notifying ${contacts.length} emergency contacts for user ${userId}.`);
            // In a real app, this would trigger SMS/email notifications.
        }
    }

    const newIncident: Omit<Incident, '_id' | 'id'> = {
        type: newIncidentData.type,
        severity: newIncidentData.severity as 'Low' | 'Medium' | 'High',
        description: newIncidentData.description,
        location: newIncidentData.location,
        image: newIncidentData.image,
        createdAt: new Date(),
        status: 'Reported',
        userId: userId,
        isSos: newIncidentData.isSos || false,
    };
    const result = await incidentsCollection.insertOne(newIncident as any);

    const insertedDoc = {
      ...newIncident,
      _id: result.insertedId,
      id: result.insertedId.toString()
    } as Incident

    return serializeIncident(insertedDoc);
}


export async function updateIncidentStatus(id: string, status: 'In Progress' | 'Resolved'): Promise<IncidentSerializable | null> {
    const incidentsCollection = await getIncidentsCollection();
    const result = await incidentsCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { status: status } },
        { returnDocument: 'after' }
    );
    if (result) {
        return serializeIncident(result as Incident);
    }
    return null;
}

export async function deleteIncident(id: string): Promise<{ success: boolean }> {
    const incidentsCollection = await getIncidentsCollection();
    const result = await incidentsCollection.deleteOne({ _id: new ObjectId(id) });
    return { success: result.deletedCount > 0 };
}
