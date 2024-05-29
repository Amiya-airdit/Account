const cds = require("@sap/cds");
const { MongoClient } = require("mongodb");
 
// MongoDB connection URI :-
const uri = "mongodb://Amiya:Amiya1999@74.225.222.62:27017/";
 
// MongoDB Client setup :-
let client;
let mongoCollection;
 
async function connectToMongoDB() {
client = new MongoClient(uri, {
useNewUrlParser: true,
useUnifiedTopology: true,
});
try {
await client.connect();
const database = client.db("Pratham"); // Specify your database name
mongoCollection = database.collection("departments"); // Specify your collection name
console.log("Connected to MongoDB!");
} catch (err) {
console.error("Failed to connect to MongoDB", err);
}
}
 
module.exports = cds.service.impl(async function () {
// Connect to MongoDB when the service starts
await connectToMongoDB();
 
const { departments } = this.entities;
 
//Creating account here :-
this.before("CREATE", departments, async (req) => {
console.log("Before creating a department:", req.data);
});
this.on("CREATE", departments, async (req) => {
try {
const now = new Date();
const formattedDate =
now.getDate().toString().padStart(2, "0") +
"-" +
(now.getMonth() + 1).toString().padStart(2, "0") +
"-" +
now.getFullYear().toString() +
"," +
now.getHours().toString().padStart(2, "0") +
":" +
now.getMinutes().toString().padStart(2, "0");
 
const accountsData = {
...req.data,
createdDateTime: formattedDate,
};
// Insert the document into MongoDB
const result = await mongoCollection.insertOne(accountsData);
console.log(
`Document inserted in MongoDB with _id: ${result.insertedId}`
);
 
// Return the inserted document with the MongoDB-generated ID and formatted createdDateTime
return accountsData;
} catch (err) {
console.error("Error inserting document into MongoDB", err);
req.error(500, "Unable to insert data");
}
});
 
this.on("READ", departments, async (req) => {
try {
let query = {}; //For search operation and for update as well of particular/ Unique data
 
// Extract conditions from the req.query.SELECT.where clause if it exists
if (req.query.SELECT.where) {
const whereClause = req.query.SELECT.where;
for (let i = 0; i < whereClause.length; i += 2) {
// Check for field and value pairs
if (whereClause[i].ref && whereClause[i + 1] === "=") {
const field = whereClause[i].ref[0];
const value = whereClause[i + 2].val;
query[field] = value;
i++;
}
}
}
 
console.log("Query based on conditions:", query);
 
// Fetch documents based on constructed query
const documents = await mongoCollection.find(query).toArray();
console.log("Fetched documents:", documents);
 
// Calculate the total count of records matching the query
const totalCount = await mongoCollection.countDocuments(query);
console.log(totalCount, "---------------count");
 
//added createdBy field to each record so we added temp .
const result = documents.map((doc) => ({
...doc,
createdBy: "Super User",
}));
 
result["$count"] = totalCount;
return result;
} catch (err) {
console.error("Error reading documents from MongoDB", err);
req.error(500, "Unable to fetch data");
return [];
}
});
 
//Update the account record here :
// http://localhost:4004/odata/v4/account/deptviews(id=3a56a681-f102-480f-8696-b40ba5431400)(postman id format)
this.on("PUT", departments, async (req) => {
const name = req.params[0].name;
const { postalcode, applicationType, description } = req.data;
 
try {
// console.log("Updating document in MongoDB with ID:", id);
 
const result = await mongoCollection.updateOne(
{ name: name },
{ $set: { postalcode, applicationType, description } }
);
 
if (result.matchedCount === 0) {
req.error(404, "Document not found");
}
 
console.log("Document updated successfully");
return result;
} catch (err) {
console.error("Error updating document in MongoDB", err);
}
});
 
// Delete account record here :-
this.on("DELETE", departments, async (req) => {
try {
const name = req.params[0].name; // Extract the ID from the request URL parameters
 
const result = await mongoCollection.deleteOne({ name: name });
if (result.deletedCount === 1) {
console.log(
`Document with ID ${name} deleted successfully from MongoDB`
);
} else {
console.log(`No document found with ID ${name}`);
}
} catch (error) {
console.error("Error deleting document from MongoDB", error);
}
});
 
this.on("disconnect", async () => {
if (client) {
await client.close();
console.log("Disconnected from MongoDB.");
}
});
});