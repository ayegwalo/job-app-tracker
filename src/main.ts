import './style.css'
import { Client, Databases, ID } from 'appwrite';
import { PROJECT_ID, DATABASE_ID, COLLECTION_ID } from './config';
import { setupCounter } from './counter';

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject(PROJECT_ID) // Replace with your project ID;

const databases = new Databases(client);

const form = document.querySelector('form');

form?.addEventListener('submit', addJob);


function addJob(e: SubmitEvent ) {
    e.preventDefault();


    const job = databases.createDocument(
      DATABASE_ID, // Replace with your database ID
      COLLECTION_ID, // Replace with your collection ID
      ID.unique(),
      {
          "company-name": (e.target as HTMLFormElement).companyName.value,
          "date-added": (e.target as HTMLFormElement).dateAdded.value,
          "role": ((e.target as HTMLFormElement).querySelector('[name="role"]') as HTMLInputElement)?.value || '',
          "location": (e.target as HTMLFormElement).location.value,
          "position-type": (e.target as HTMLFormElement).positionType.value,
          "source": (e.target as HTMLFormElement).source.value,
          "salary": 20000
      }
    );
    job.then(function (response) {
      getJobs(); // Refresh the job list after adding a new job
      console.log(response); // Success
  }, function (error) {
      console.log(error); // Failure
  });

    // Reset the form after submission
  form?.reset();
}


// Get all jobs fro Backend
async function getJobs() {

  // Clear the list before fetching new jobs
  const ulElement = document.querySelector('ul') as HTMLUListElement | null;
  if (ulElement) {
      ulElement.innerHTML = '';
  }

  try { 
    const response = await databases.listDocuments(
    DATABASE_ID,
    COLLECTION_ID,
    );
    console.log(response);

    // Process the response to display jobs on the page
    response.documents.forEach((job) => {
      const li = document.createElement('li');

      li.textContent = `${job['company-name']} ${job['date-added']} ${job['role']} ${job['location']} 
      ${job['position-type']} ${job['source']} ${job['salary']} coffee chart? ${job['chat']} `;
      

      li.id = job.$id; // Set the id of the list item to the job's document ID



      // Create a delete button for each job
      const deleteBtn = document.createElement('button');
      // Append the delete button to the list item
      deleteBtn.textContent = '🔥 Delete items';
      deleteBtn.onclick = () => removeJob(job.$id)
      // li.appendChild(deleteBtn);


      const editBtn = document.createElement('button');
      // Append the edit button to the list item
      editBtn.textContent = '✏️ Toggle chat';
      editBtn.onclick = () => updateChat(job.$id)
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);




      // Append the list item to the unordered list
      document.querySelector('ul')?.appendChild(li);
    })


  async function removeJob(id: string) { 
    const result = await databases.deleteDocument(
      DATABASE_ID, // databaseId
      COLLECTION_ID, // collectionId
      id // documentId
  );
  document.getElementById(id)?.remove(); // Remove the job from the list
  console.log('Job deleted:', result);
  }   
  
  async function updateChat(id: string) {
    const result = databases.updateDocument(
      DATABASE_ID, // databaseId
      COLLECTION_ID, // collectionId
      id, // documentId
      {chat: true}, // data (optional)
  );
  result.then(function(){location.reload()});

  }

  } catch (error) {
  console.error('Error fetching jobs:', error);
  }
  
  
}


// Uncomment the following line to fetch jobs when the script runs
getJobs();


// SEND THIS TO THE FUNCTION
// const promise = databases.createDocument(
//     DATABASE_ID, // Replace with your database ID
//     COLLECTION_ID, // Replace with your collection ID
//     ID.unique(),
//     { "company-name": "Ayegwalo-Company",
//       "date-added": new Date(),
//       "role": "DevOps Engineer",
//       "location": "Remote",
//       "position-type": "Full-time",
//       "source": "https://google.com",
//       "salary": 20000
//      }
// );



document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('counter-button') as HTMLButtonElement;
  if (button) {
    setupCounter(button);
  }
});