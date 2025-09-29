import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  // These would be environment variables in production
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (mock for demo)
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export interface FRARecord {
  id?: string;
  date: string;
  year: number;
  month: string;
  state: string;
  individualClaimsReceived: number;
  communityClaimsReceived: number;
  totalClaimsReceived: number;
  individualTitlesDistributed: number;
  communityTitlesDistributed: number;
  totalTitlesDistributed: number;
  claimsRejected: number;
  totalClaimsDisposedOff: number;
  percentageClaimsDisposedOff: number;
  areaHaIFRTitlesDistributed: number;
  areaHaCFRTitlesDistributed: number;
  uploadDate: string;
  fileName: string;
  fileSize: number;
}

// Save extracted FRA data to Firebase
export async function saveFRARecord(
  record: Omit<FRARecord, "id">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "fra_records"), record);
    return docRef.id;
  } catch (error) {
    console.error("Error saving FRA record:", error);
    throw error;
  }
}

// Get FRA records with optional filtering
export async function getFRARecords(filters?: {
  state?: string;
  year?: number;
  month?: string;
}): Promise<FRARecord[]> {
  try {
    let q = query(collection(db, "fra_records"), orderBy("uploadDate", "desc"));

    if (filters?.state && filters.state !== "all") {
      q = query(q, where("state", "==", filters.state));
    }

    if (filters?.year) {
      q = query(q, where("year", "==", filters.year));
    }

    if (filters?.month && filters.month !== "all") {
      q = query(q, where("month", "==", filters.month));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FRARecord)
    );
  } catch (error) {
    console.error("Error fetching FRA records:", error);
    return [];
  }
}

// Get aggregated statistics
export async function getFRAStatistics(state?: string) {
  try {
    const records = await getFRARecords({ state });

    if (records.length === 0) {
      return {
        totalClaimsReceived: 0,
        totalTitlesDistributed: 0,
        totalForestLand: 0,
        claimsDisposalRate: 0,
      };
    }

    const totals = records.reduce(
      (acc, record) => ({
        totalClaimsReceived:
          acc.totalClaimsReceived + record.totalClaimsReceived,
        totalTitlesDistributed:
          acc.totalTitlesDistributed + record.totalTitlesDistributed,
        totalForestLand:
          acc.totalForestLand +
          record.areaHaIFRTitlesDistributed +
          record.areaHaCFRTitlesDistributed,
        totalDisposed: acc.totalDisposed + record.totalClaimsDisposedOff,
      }),
      {
        totalClaimsReceived: 0,
        totalTitlesDistributed: 0,
        totalForestLand: 0,
        totalDisposed: 0,
      }
    );

    return {
      ...totals,
      claimsDisposalRate:
        totals.totalClaimsReceived > 0
          ? (totals.totalDisposed / totals.totalClaimsReceived) * 100
          : 0,
    };
  } catch (error) {
    console.error("Error calculating statistics:", error);
    return {
      totalClaimsReceived: 0,
      totalTitlesDistributed: 0,
      totalForestLand: 0,
      claimsDisposalRate: 0,
    };
  }
}

export interface PattaHolder {
  id?: string;
  claimNumber: string;
  applicantName: string;
  applicantAddress: string;
  village: string;
  district: string;
  state: string;
  claimType: "Individual" | "Community";
  landArea: number;
  landDescription: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Save patta holder to Firebase
export async function savePattaHolder(
  holder: Omit<PattaHolder, "id">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "patta_holders"), holder);
    return docRef.id;
  } catch (error) {
    console.error("Error saving patta holder:", error);
    throw error;
  }
}

// Get all patta holders
export async function getPattaHolders(): Promise<PattaHolder[]> {
  try {
    const q = query(
      collection(db, "patta_holders"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as PattaHolder)
    );
  } catch (error) {
    console.error("Error fetching patta holders:", error);
    return [];
  }
}

// Get patta holder by ID
export async function getPattaHolderById(
  id: string
): Promise<PattaHolder | null> {
  try {
    const q = query(collection(db, "patta_holders"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) return null;

    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as PattaHolder;
  } catch (error) {
    console.error("Error fetching patta holder:", error);
    return null;
  }
}
