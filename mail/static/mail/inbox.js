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
  var mail_div = document.createElement("div");
  //adding this div to div containing all the e-mails
  document.querySelector('#emails-view').appendChild(mail_div);
  //adding class so that we will have a border
  mail_div.setAttribute('class', 'border-top border-bottom row p-2 h6 m-0'); 
  //setting the text
  mail_div.innerHTML = `<div class="col-3 ">${mail.sender}</div>  <div class="col-5">${mail.subject}</div>  <div class = "col-3">${mail.timestamp}</div> <div id="for_button${mail.id}" class = "col-1"></div>`;
  //creating button to atrchive
  let archive_button = document.createElement("button");
  //setting attributes to button
  archive_button.setAttribute("class",'btn btn-secondary btn-sm archive p-1');
  archive_button.setAttribute("data-bs-toggle",'tooltip');
  archive_button.setAttribute("data-bs-placement",'top');
  archive_button.setAttribute("id",`mail${mail.id}`);
  archive_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16"><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>';
  div_for_button = document.querySelector(`#for_button${mail.id}`);
  div_for_button.append(archive_button);
  
  
  
  if (mailbox == 'sent'){
    document.querySelector(`#mail${mail.id}`).style.display = "none";
  }
  else
  {
    if(mailbox === "inbox")
    {
      document.querySelector(`#mail${mail.id}`).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive" viewBox="0 0 16 16"><path d="M0 2a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 1 12.5V5a1 1 0 0 1-1-1V2zm2 3v7.5A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5H2zm13-3H1v2h14V2zM5 7.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/></svg>';
      document.querySelector(`#mail${mail.id}`).setAttribute("title","Archive");
    }
    else
    {
      document.querySelector(`#mail${mail.id}`).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-archive-fill" viewBox="0 0 16 16"><path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15h9.286zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1zM.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8H.8z"/></svg>';
      document.querySelector(`#mail${mail.id}`).setAttribute("title","Disarchive");
    }
    document.querySelector(`#mail${mail.id}`).addEventListener('click', () => change_status(mail.id,mail.archived));
  }
    
  
  //clicking on e-mail will open it
  mail_div.addEventListener('click', function() {
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
    mail_div.classList.remove('h6');
    mail_div.classList.add('bg-light');
  }
  else
  {
    mail_div.classList.add('h6');
    mail_div.classList.remove('bg-light');
  }
}

//Function to show clicked e-mail
function show_email(email)
{

  const mail = document.querySelector('#email');
  mail.style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#title').innerHTML = `<b> Subject: </b>${email.subject}`;
  document.querySelector('#sender').innerHTML = `<b>From: </b>${email.sender}`;
  document.querySelector('#receiver').innerHTML = `<b>To: </b>${email.recipients}`;
  document.querySelector('#timestamp').innerHTML = `<b>Timestamp: </b>${email.timestamp}`;

  document.querySelector('#body').innerHTML = `${email.body}`;
  document.querySelector('#reply').addEventListener('click', () => compose_email(email.sender, `Re: ${email.subject}`, `On ${email.timestamp}  ${email.sender} wrote: 
  ${email.body}`));
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })

}

//Function to  change status
function change_status(email,status){
    fetch(`/emails/${email}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: !status
    })
  })
  .then(window.location.reload())
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
