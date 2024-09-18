/*
Adapted from https://www.gmass.co/blog/add-needs-reply-label/


INSTRUCTIONS FOR PERSONALIZATION:
Write your email inside the quotes on line 36.


LABELS TO HAVE IN GMAIL (or re-write this code for the labels you have):
  ..Received/Received today
  ..Received/Received yesterday
  ..Received/Received past few days
Note there should be an outer label named "..Received" and three inner labels named "Received today", etc. I recommend color-coding the labels in Gmail so you can glance at your inbox and see when you received your most-recent messages.


CODE SECTIONS:
  RECEIVED TODAY:
    received_today() un-labels all already-labelled messages then does labelling for inbox's messages received or snoozed until today
    received_today_me() is tweaked version of today to catch emails you sent yourself

  RECEIVED YESTERDAY:
    received_yest() un-labels all already-labelled messages then does labelling for inbox's messages received or snoozed until yesterday
    received_yest_me() is tweaked version of yest to catch emails you sent yourself

  RECEIVED PAST FEW DAYS:
    received_few_days_ago() un-labels all already-labelled messages then does labelling for inbox's messages received or snoozed until between four days ago and three days ago
    received_few_days_ago_me() is tweaked version to catch emails you sent yourself
Note running main() calls all six functions, so you can set up a time trigger for this script (e.g., mine runs every hour) and call only this function, and you'll run each of the others. For information about time triggers, see here: https://developers.google.com/apps-script/guides/triggers/installable#manage_triggers_manually.

I think the time zones for the script are UTC, but I'm not quite sure. So, the whole today/tomorrow/past few days distinction will be a bit off, but I've never had an issue with it and haven't looked too much into making the script operate in my time zone. If you want to fix the time zone thing for yourself, this exchange might be a good starting point: https://stackoverflow.com/a/18597149.
*/



function main() {
  var my_email = "write_your_email_here"

  received_today()
  received_today_me(my_email)

  received_yest()
  received_yest_me(my_email)

  received_few_days_ago()
  received_few_days_ago_me(my_email)
}




function received_today() {
  //set label
  var received_today_label = GmailApp.getUserLabelByName("..Received/Received today");

  //remove label already on any messages NOT in trash
  var threads_already_labelled = GmailApp.search('label:..Received/Received today');
  received_today_label.removeFromThreads(threads_already_labelled);

  //remove label already on any messages in trash (not re-adding the label given already deleted)
  var threads_already_labelled_trash = GmailApp.search('in:trash AND label:..Received/Received today');
  received_today_label.removeFromThreads(threads_already_labelled_trash);

  // get today's date for labelling
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const today_formatted = today.toLocaleDateString();

  // pull threads to label and email info
  var threads = GmailApp.search('in:inbox AND after:' + today_formatted);
  var currentUserEmail = Session.getActiveUser().getEmail();

  // do labelling
  for (var i = 0; i < threads.length; i++) {
    var lastMessage = threads[i].getMessages()[threads[i].getMessageCount() - 1];
    var lastMessageFrom = lastMessage.getFrom();
    //console.log(lastMessageFrom.indexOf(currentUserEmail));
    if (lastMessageFrom.indexOf(currentUserEmail) == -1) {
      //console.log("inside if statement and adding to thread...")
      received_today_label.addToThread(threads[i]);
      //console.log("added to thread")
    }
    else  {
      received_today_label.removeFromThread(threads[i]);
    }
  }  
}



function received_today_me(my_email) {
  //set label
  var received_today_label = GmailApp.getUserLabelByName("..Received/Received today");

  //remove label already on any messages NOT in trash
  var threads_already_labelled = GmailApp.search('from:' + my_email + ' AND label:..Received/Received today');
  received_today_label.removeFromThreads(threads_already_labelled);

  //remove label already on any messages in trash (not re-adding the label given already deleted)
  var threads_already_labelled_trash = GmailApp.search('from:' + my_email + ' AND in:trash AND label:..Received/Received today');
  received_today_label.removeFromThreads(threads_already_labelled_trash);

  // get today's date for labelling
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const today_formatted = today.toLocaleDateString();

  // pull threads to label
  var threads = GmailApp.search('in:inbox AND from:' + my_email + ' AND after:' + today_formatted);

  // do labelling
  received_today_label.addToThreads(threads);
}





function received_yest() {
  //set label
  var received_yest_label = GmailApp.getUserLabelByName("..Received/Received yesterday");
  
  //remove label already on any messages NOT in trash
  var threads_already_labelled = GmailApp.search('label:..Received/Received yesterday');
  received_yest_label.removeFromThreads(threads_already_labelled);

  //remove label already on any messages in trash (not re-adding the label given already deleted)
  var threads_already_labelled_trash = GmailApp.search('in:trash AND label:..Received/Received yesterday');
  received_yest_label.removeFromThreads(threads_already_labelled_trash);

  // get today's date
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const today_formatted = today.toLocaleDateString();

  // get yesterday's date
  var yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yest_formatted = String(yest.toLocaleDateString());

  // pul threads to label and email info
  var threads = GmailApp.search('in:inbox AND after:' + yest_formatted + " AND before:" + today_formatted);
  var currentUserEmail = Session.getActiveUser().getEmail();

  // do labelling
  for (var i = 0; i < threads.length; i++) {
    var lastMessage = threads[i].getMessages()[threads[i].getMessageCount() - 1];
    var lastMessageFrom = lastMessage.getFrom();
    if (lastMessageFrom.indexOf(currentUserEmail) == -1) {
      received_yest_label.addToThread(threads[i]);
    }
    else  {
      received_yest_label.removeFromThread(threads[i]);
    }
  }  
}





function received_yest_me(my_email) {
  //set label
  var received_yest_label = GmailApp.getUserLabelByName("..Received/Received yesterday");
  
  //remove label already on any messages NOT in trash
  var threads_already_labelled = GmailApp.search('from:' + my_email + ' AND label:..Received/Received yesterday');
  received_yest_label.removeFromThreads(threads_already_labelled);

  //remove label already on any messages in trash (not re-adding the label given already deleted)
  var threads_already_labelled_trash = GmailApp.search('from:' + my_email + ' AND in:trash AND label:..Received/Received yesterday');
  received_yest_label.removeFromThreads(threads_already_labelled_trash);

  // get today's date
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  const today_formatted = today.toLocaleDateString();

  // get yesterday's date
  var yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yest_formatted = String(yest.toLocaleDateString());

  // pul threads to label and email info
  var threads = GmailApp.search('in:inbox AND from:' + my_email + ' AND after:' + yest_formatted + " AND before:" + today_formatted);

  // do labelling
  received_yest_label.addToThreads(threads);
}






function received_few_days_ago() {
  //set label
  var received_few_days_ago_label = GmailApp.getUserLabelByName("..Received/Received past few days");
  
  //remove label already on any messages NOT in trash
  var threads_already_labelled = GmailApp.search('label:..Received/Received past few days');
  received_few_days_ago_label.removeFromThreads(threads_already_labelled);

  //remove label already on any messages in trash (not re-adding the label given already deleted)
  var threads_already_labelled_trash = GmailApp.search('in:trash AND label:..Received/Received past few days');
  received_few_days_ago_label.removeFromThreads(threads_already_labelled_trash);

  // get yesterday's date
  var yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yest_formatted = String(yest.toLocaleDateString());

  // get date from five days ago
  var five_days_ago = new Date();
  five_days_ago.setDate(yest.getDate() - 3);
  const five_days_ago_formatted = String(five_days_ago.toLocaleDateString());

  // pul threads to label and email info
  var threads = GmailApp.search('in:inbox AND after:' + five_days_ago_formatted + " AND before:" + yest_formatted);
  var currentUserEmail = Session.getActiveUser().getEmail();

  // do labelling
  for (var i = 0; i < threads.length; i++) {
    var lastMessage = threads[i].getMessages()[threads[i].getMessageCount() - 1];
    var lastMessageFrom = lastMessage.getFrom();
    if (lastMessageFrom.indexOf(currentUserEmail) == -1) {
      received_few_days_ago_label.addToThread(threads[i]);
    }
    else  {
      received_few_days_ago_label.removeFromThread(threads[i]);
    }
  }  
}



function received_few_days_ago_me(my_email) {
  //set label
  var received_few_days_ago_label = GmailApp.getUserLabelByName("..Received/Received past few days");
  
  //remove label already on any messages NOT in trash
  var threads_already_labelled = GmailApp.search('from:' + my_email + ' AND label:..Received/Received past few days');
  received_few_days_ago_label.removeFromThreads(threads_already_labelled);

  //remove label already on any messages in trash (not re-adding the label given already deleted)
  var threads_already_labelled_trash = GmailApp.search('from:' + my_email + ' AND in:trash AND label:..Received/Received past few days');
  received_few_days_ago_label.removeFromThreads(threads_already_labelled_trash);

  // get yesterday's date
  var yest = new Date();
  yest.setDate(yest.getDate() - 1);
  const yest_formatted = String(yest.toLocaleDateString());

  // get date from five days ago
  var five_days_ago = new Date();
  five_days_ago.setDate(yest.getDate() - 3);
  const five_days_ago_formatted = String(five_days_ago.toLocaleDateString());

  // pul threads to label and email info
  var threads = GmailApp.search('in:inbox AND from:' + my_email + ' AND after:' + five_days_ago_formatted + " AND before:" + yest_formatted);
  
  // do labelling
  received_few_days_ago_label.addToThreads(threads);
}




