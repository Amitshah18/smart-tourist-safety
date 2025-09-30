
'use server';

import { Collection, Db, MongoClient, ObjectId } from 'mongodb';
import clientPromise from './mongodb';

export interface Contact {
  _id: ObjectId;
  userId: string;
  name: string;
  phone: string;
}

export type ContactSerializable = Omit<Contact, '_id'> & {
  _id: string;
};

let client: MongoClient;
let db: Db;
let contacts: Collection<Contact>;

async function getContactsCollection(): Promise<Collection<Contact>> {
  if (contacts) return contacts;
  client = await clientPromise;
  db = client.db();
  contacts = db.collection<Contact>('contacts');
  return contacts;
}

function serializeContact(contact: Contact): ContactSerializable {
  return {
    ...contact,
    _id: contact._id.toString(),
  };
}

export async function getContacts(userId: string = '1'): Promise<Array<{ name: string; phone: string }>> {
    const contactsCollection = await getContactsCollection();
    const userContacts = await contactsCollection.find({ userId: userId }).toArray();
    return userContacts.map(c => ({ name: c.name, phone: c.phone }));
}

export async function saveContacts(
    newContacts: Array<{ name: string; phone: string }>,
    userId: string = '1'
): Promise<void> {
    const contactsCollection = await getContactsCollection();
    
    // Delete existing contacts for the user
    await contactsCollection.deleteMany({ userId: userId });

    // Insert new contacts if they are not empty
    const contactsToInsert = newContacts.filter(c => c.name && c.phone);
    if (contactsToInsert.length > 0) {
        const fullContacts = contactsToInsert.map(contact => ({
            ...contact,
            userId: userId,
            _id: new ObjectId(),
        }));
        await contactsCollection.insertMany(fullContacts);
    }
}
