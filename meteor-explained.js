if (Meteor.isClient) {
  var bank = new ReactiveDict();
  bank.set('savings', 50);
  bank.set('checking', 10);
  bank.set('checksAllowed', true);

  Tracker.autorun(function() {
    if (bank.get('checksAllowed')) {
      console.log('Go ahead and write some checks!');
    } else {
      console.log('No money available, checks suspended!');
    }
  });

  // disable checkWriting when there isn't money
  Tracker.autorun(function() {
    console.log("There is $" + bank.get("checking") + " in your checking account.");

    // afterFlush because we want to allow overdraft protection a chance
    Tracker.afterFlush(function() {
      if (bank.get('checking') < 0) {
        console.log('No more checks for you!');
        bank.set('checksAllowed', false);
      }
    });
  });

  writeACheck = function(amount) {
    if (bank.get('checksAllowed')) {
      bank.set('checking', bank.get('checking') - amount);
    }
  }

  // overdraft protection
  Tracker.autorun(function() {
    if (bank.get('checking') < 0 && bank.get('savings') >= 25) {
      bank.set('checking', bank.get('checking') + 25);
      bank.set('savings', bank.get('savings') - 25);
      console.log('Check writing privilege restored. Checking: ' + bank.get('checking') + '. Savings: ' + bank.get('savings'));
    }
  });
}
