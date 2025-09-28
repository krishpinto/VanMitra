const sampleData = [
  {
    date: "01.06.2025",
    year: 2025,
    month: "June",
    state: "Chhattisgarh",
    individualClaimsReceived: 45000,
    communityClaimsReceived: 845000,
    totalClaimsReceived: 890000,
    individualTitlesDistributed: 28000,
    communityTitlesDistributed: 453000,
    totalTitlesDistributed: 481000,
    claimsRejected: 125000,
    totalClaimsDisposedOff: 606000,
    percentageClaimsDisposedOff: 68.1,
    areaHaIFRTitlesDistributed: 3200000,
    areaHaCFRTitlesDistributed: 9103000,
    uploadDate: new Date().toISOString(),
    fileName: "chhattisgarh_fra_june_2025.pdf",
    fileSize: 2048576,
  },
  {
    date: "01.06.2025",
    year: 2025,
    month: "June",
    state: "Odisha",
    individualClaimsReceived: 38000,
    communityClaimsReceived: 663000,
    totalClaimsReceived: 701000,
    individualTitlesDistributed: 25000,
    communityTitlesDistributed: 437000,
    totalTitlesDistributed: 462000,
    claimsRejected: 89000,
    totalClaimsDisposedOff: 551000,
    percentageClaimsDisposedOff: 78.6,
    areaHaIFRTitlesDistributed: 2800000,
    areaHaCFRTitlesDistributed: 743000,
    uploadDate: new Date().toISOString(),
    fileName: "odisha_fra_june_2025.pdf",
    fileSize: 1876543,
  },
  {
    date: "01.06.2025",
    year: 2025,
    month: "June",
    state: "Telangana",
    individualClaimsReceived: 32000,
    communityClaimsReceived: 620000,
    totalClaimsReceived: 652000,
    individualTitlesDistributed: 15000,
    communityTitlesDistributed: 216000,
    totalTitlesDistributed: 231000,
    claimsRejected: 156000,
    totalClaimsDisposedOff: 387000,
    percentageClaimsDisposedOff: 59.4,
    areaHaIFRTitlesDistributed: 1800000,
    areaHaCFRTitlesDistributed: 580000,
    uploadDate: new Date().toISOString(),
    fileName: "telangana_fra_june_2025.pdf",
    fileSize: 1654321,
  },
]

console.log("Sample FRA data created:")
console.log(JSON.stringify(sampleData, null, 2))

// In a real implementation, this would save to Firebase:
// import { saveFRARecord } from '../lib/firebase'
//
// async function createSampleData() {
//   for (const record of sampleData) {
//     try {
//       const id = await saveFRARecord(record)
//       console.log(`Created record with ID: ${id}`)
//     } catch (error) {
//       console.error('Error creating record:', error)
//     }
//   }
// }
//
// createSampleData()
