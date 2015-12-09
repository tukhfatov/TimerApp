// Name: Timer script
// Author: Tukhfatov Margulan
// Modified: 6/11/2015

function Timer(duration, displayName) {

  this.duration = duration;
  this.field = $("#"+displayName);
  var self = this;
  this.refreshId = NaN;
  this.getRemainingTime = function(){
    var hours, minutes, seconds;
    seconds = Math.floor( (this.duration) % 60 );
    seconds = seconds < 10 ? "0"+seconds : seconds;
    minutes = Math.floor( (this.duration/60) % 60 );
    minutes = minutes < 10 ? "0"+minutes: minutes;
    hours = Math.floor( (this.duration/ (60*60)) % 60 );
    hours = hours < 10 ? "0"+hours : hours;
    return {
     'hours': hours,
     'minutes': minutes,
     'seconds': seconds
    };
  }
  this.displayTo = function(time){
    this.field.html(time.hours+":"+time.minutes+":"+time.seconds);
  }
  this.stop = function(){
    if (!isNaN(this.refreshId)){
      window.clearInterval(this.refreshId);
    }
  }
  this.run = function(){
    this.refreshId = setInterval(function(){
      self.displayTo(self.getRemainingTime());
      if (self.duration <= 0){

        var notification = new Notification('Время закончилось', {
          body: 'Время клиента закончилось!'
        });

        notification.onshow = function() {
          console.log('Notification shown');
        };
        clearInterval(self.refreshId);
      }else{
        self.duration--;
      }
    }, 1000);
  }
}

module.exports = Timer
