document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
  // Sending e-mail
  document.querySelector('#compose-submit').addEventListener('click',sent_mail);

  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

 

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Show e-mails
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    // Print emails
    console.log(emails);

    // ... do something else with emails ...
    emails.forEach(email => get_emails(email,mailbox));
  }
  )
}

//function to get all the email in mailbox
function get_emails(mail,mailbox){
  //Creating a new div for every mail
  var div = document.createElement("div");
  //adding this div to div containing all the e-mails
  document.querySelector('#emails-view').appendChild(div);
  //adding class so that we will have a border
  div.setAttribute('class', 'border'); 
  //creating button to atrchive
  let archive_button = document.createElement("button");
  archive_button.setAttribute("class","archive");
  archive_button.innerHTML = "Archive";
  div.appendChild(archive_button);
  div.innerHTML += `Sender: ${mail.sender}  Recipients: ${mail.recipients} Subject: ${mail.subject}  Timestamp: ${mail.timestamp} Read: ${mail.read} `;
  
  
  if (mailbox == 'sent'){
    document.querySelectorAll(".archive").style.display = "none";
    console.log("You can't archive sent message");
  }
  else
  {
    if(mailbox === "inbox")
    {
      document.querySelector(".archive").innerHTML = "Archive";
      console.log("testing if archiving is working")
    }
    else
    {
      document.querySelector(".archive").innerHTML = "Disarchive";
      console.log("testing if this is working")
    }
    document.querySelector(".archive").addEventListener('click', function() {
      fetch(`/emails/${mail.id}`)
      .then(response => response.json())
      .then(email => {
          // Print email
          console.log(email);
      
          // ... do something else with email ...
          if(mailbox === "inbox")
          {
            //start archiving function
            archive(email,archive_button);
            localStorage.clear();
          }
          else
          {
            //start disarchving function
            disarchive(email,archive_button);
            localStorage.clear();
          }
      });
    });
  }
    
  
  //clicking on e-mail will open it
  div.addEventListener('click', function() {
    fetch(`/emails/${mail.id}`)
    .then(response => response.json())
    .then(email => {
        // Print email
        console.log(email);
    
        // ... do something else with email ...
        
        show_email(email, mailbox);
    });
  });
  if (mail.read == true)
  {
    div.style.backgroundColor = 'silver';
  }
  else
  {
    div.style.backgroundColor = 'white';
  }
}

//Function to show clicked e-mail
function show_email(email)
{

  const mail = document.querySelector('#email');
  mail.style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  
  document.querySelector('#title').innerHTML = `<h2> Subject: ${email.subject}</h2>`;
  document.querySelector('#sender').innerHTML = `<h3>${email.sender}</h3>`;
  document.querySelector('#body').innerHTML = `${email.body}`;
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

}

//Function to archive
function archive(email,button){
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  button.innerHTML = 'Disarchive';
}

//Function to disarchive
function disarchive(email,button){
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  button.innerHTML = 'Archive';
}


//Function to send e-mail
function sent_mail(){
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  })
  localStorage.clear();
  load_mailbox('sent');
  return false;
}
