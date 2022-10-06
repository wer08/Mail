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

  function get_emails(email,mailbox){
    var div = document.createElement("div");
    document.querySelector('#emails-view').appendChild(div);
    div.setAttribute('class', 'border'); 
    //clicking on e-mail will open it
    div.addEventListener('click', function() {
      show_email(email,mailbox);
    });
    if (email.read == true)
    {
      div.style.backgroundColor = 'silver';
    }
    else
    {
      div.style.backgroundColor = 'white';
    }
    div.innerHTML = `Sender: ${email.sender}  Recipients: ${email.recipients} Subject: ${email.subject}  Timestamp: ${email.timestamp} Read: ${email.read}`;
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

//Function to show clicked e-mail
function show_email(email,mailbox)
{
  let mail = document.querySelector('#email');
  mail.style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  let archive_button = document.querySelector('#archive');
  if (mailbox == 'sent'){
    archive_button.style.display = 'none';
    console.log("You can't archive sent message");
  }
  else
  {
    if(email.archived == true)
    {
      archive_button.innerHTML = 'Disarchive';
    }
    else
    {
      archive_button.innerHTML = 'Archive';
    }
    
    archive_button.addEventListener('click',function () {
      if(email.archived == true)
      {
        disarchive(email,archive_button);
        console.log(email.subject);
        load_mailbox('inbox')
      }
      else
      {
        archive(email,archive_button);
        console.log(email.subject);
        load_mailbox('archive')
      }

    });

  }
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
}
