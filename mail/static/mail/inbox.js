document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', () => compose_email("","",""));
  
  // By default, load the inbox
  load_mailbox('inbox');
  // Sending e-mail
  document.querySelector('#compose-submit').addEventListener('click',sent_mail);

  
});

function compose_email(recipients, subject, body) {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = recipients;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
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
  archive_button.setAttribute("class",'btn btn-primary btn-sm archive');
  archive_button.setAttribute("id",`mail${mail.id}`);
  archive_button.innerHTML = "Archive";
  div.append(archive_button);
  div.innerHTML += `Sender: ${mail.sender}  Recipients: ${mail.recipients} Subject: ${mail.subject}  Timestamp: ${mail.timestamp}`;
  
  
  if (mailbox == 'sent'){
    document.querySelector(`#mail${mail.id}`).style.display = "none";
    console.log("You can't archive sent message");
  }
  else
  {
    if(mailbox === "inbox")
    {
      document.querySelector(`#mail${mail.id}`).innerHTML = "Archive";
    }
    else
    {
      document.querySelector(`#mail${mail.id}`).innerHTML = "Disarchive";
    }
    document.querySelector(`#mail${mail.id}`).addEventListener('click', function() {
      fetch(`/emails/${mail.id}`)
      .then(response => response.json())
      .then(email => {
          // Print email
          console.log(email);
      
          // ... do something else with email ...
          if(email.archived === false)
          {
            //start archiving function
            archive(email);
            console.log(`${email.subject}`)
            console.count(`${email.archived}`)
            localStorage.clear();
          }
          else
          {
            //start disarchving function
            disarchive(email);
            console.log(`${email.subject}`)
            console.count(`${email.archived}`)
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
        
        show_email(email);
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
  document.querySelector('#reply').addEventListener('click', () => compose_email(email.sender, `Re: ${email.subject}`, `On ${email.timestamp}  ${email.sender} wrote: ${email.body}`));
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

}

//Function to archive
async function archive(email){
  const response = await fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true

    })
  })
  load_mailbox("inbox");
}

//Function to disarchive
async function disarchive(email){
  const response = await fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  load_mailbox("inbox");
}


//Function to send e-mail
async function sent_mail(){
  const response = await fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value,
      read: false
    })
  });
  const result_1 = await response.json();
  // Print result
  console.log(result_1.subject);
  localStorage.clear();
  load_mailbox('sent');
}
