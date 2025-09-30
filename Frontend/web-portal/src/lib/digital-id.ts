
'use server';

import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export interface DigitalId {
  _id: ObjectId;
  id: string;
  userId: string;
  fullName: string;
  documentNumber: string;
  documentType: string;
  nationality: string;
  issuedAt: Date;
  validUntil: Date;
  itinerary?: string;
  status: 'Active' | 'Expired' | 'Revoked';
}

export type DigitalIdSerializable = Omit<DigitalId, '_id' | 'issuedAt' | 'validUntil'> & {
  _id: string;
  issuedAt: string;
  validUntil: string;
};

let client: MongoClient;
let db: Db;
let digitalIds: Collection<DigitalId>;

async function getDigitalIdCollection(): Promise<Collection<DigitalId>> {
  if (digitalIds) return digitalIds;
  client = await clientPromise;
  db = client.db();
  digitalIds = db.collection<DigitalId>('digital-ids');
  return digitalIds;
}

function serializeDigitalId(id: DigitalId): DigitalIdSerializable {
  return {
    ...id,
    _id: id._id.toString(),
    id: id._id.toString(),
    issuedAt: id.issuedAt.toISOString(),
    validUntil: id.validUntil.toISOString(),
  };
}

export async function getDigitalId(userId: string = '1'): Promise<DigitalIdSerializable | null> {
    const idsCollection = await getDigitalIdCollection();
    const digitalId = await idsCollection.findOne({ userId: userId });
    return digitalId ? serializeDigitalId(digitalId) : null;
}

export async function getDigitalIdForUser(userId: string): Promise<DigitalIdSerializable | null> {
    const idsCollection = await getDigitalIdCollection();
    const digitalId = await idsCollection.findOne({ userId: userId });
    return digitalId ? serializeDigitalId(digitalId) : null;
}

export async function addDigitalId(idData: {
    userId?: string;
    fullName: string;
    documentNumber: string;
    documentType: string;
    nationality: string;
    visitStartDate: string;
    visitEndDate: string;
    itinerary?: string;
}): Promise<DigitalIdSerializable> {
    const idsCollection = await getDigitalIdCollection();
    const userId = idData.userId || '1';
    
    const newId: Omit<DigitalId, '_id' | 'id'> = {
        userId: userId,
        fullName: idData.fullName,
        documentNumber: idData.documentNumber,
        documentType: idData.documentType,
        nationality: idData.nationality,
        issuedAt: new Date(idData.visitStartDate),
        validUntil: new Date(idData.visitEndDate),
        itinerary: idData.itinerary,
        status: 'Active',
    };

    // Use updateOne with upsert to replace any existing ID for the user
    const result = await idsCollection.updateOne(
        { userId: userId },
        { $set: newId },
        { upsert: true }
    );

    const findResult = await idsCollection.findOne({ userId: userId });

    if (!findResult) {
        throw new Error('Failed to create or find the digital ID.');
    }

    return serializeDigitalId(findResult);
}

