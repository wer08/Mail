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
  if (mailbox == 'sent'){
    document.querySelector('#archive').style.display = 'none';
  }
  else
  {
    document.querySelector('#archive').style.display = 'block';
    if(email.archived == true)
    {
      document.querySelector('#archive').innerHTML = 'Disarchive';
    }
    else
    {
      document.querySelector('#archive').innerHTML = 'Archive';
    }
    
    document.querySelector('#archive').addEventListener('click',function () {
      if(email.archived == true)
      {
        
        disarchive(email);
        console.log(email.archived);
      }
      else
      {
        archive(email);
        console.log(email.archived);
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
function archive(email){
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  document.querySelector('#archive').innerHTML = 'Disarchive';
}

//Function to disarchive
function disarchive(email){
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  document.querySelector('#archive').innerHTML = 'Archive';
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
