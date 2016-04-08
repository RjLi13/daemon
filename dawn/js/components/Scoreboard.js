import React from 'react';
import TimerStore from '../stores/TimerStore';
import LighthouseTimerStore from '../stores/LighthouseTimerStore';
//import LiveScoreStore from '../stores/LiveScoreStore';
import _ from 'lodash';

var Scoreboard = React.createClass({
  getInitialState() {
    return { 
      timeLeft: 0,
      stage: "Offline",
      width: 50,
      color: "progress-bar-info",
      lighthouseTimeLeft: 0,
      lighthouseWidth: 50,
      lightouseStatus: "Offline",
      lighthouseColor: "progress-bar-info"},//;
      //Changes
      score = null,
      score-blue: 0,
      score-gold: 0;
  },
  onTimerChange() {
    this.setState({
      timeLeft: (TimerStore.getComputedTime() / 1000).toFixed(1),
      stage: TimerStore.getStage(),
      width: TimerStore.getWidth(),
      color: TimerStore.getColor()
    });
  },
  //TODO

  //CHANGES START HERE
  //UPDATING LIVE SCORING
  initializeAlliancesAndChests() {
    var alliances = {
            "blue": 0,
            "gold": 2
        }
    var chests = {
        "gold": 0,
        "pirate": 1
    }
    return [alliances, chests];
  }

  onScoreChange() {
    this.setState({
      score = LiveScoreStore.getScore();
      updateLiveScore(score);
      updateLiveScoreBreakdown(score);
    });
  }

  updateLiveScore(score) {
    var blue = 20 * score.treasure_autonomous[0] + 15 * score.treasure_autonomous[1] + 10 * score.treasure_teleop[0] + 5 * score.treasure_teleop[1];
    var gold = 20 * score.treasure_autonomous[2] + 15 * score.treasure_autonomous[3] + 10 * score.treasure_teleop[2] + 5 * score.treasure_teleop[3];
    this.setState({
      score-blue = blue;
      score-gold = gold;
    });
  }

  updateLiveScoreBreakdown(score) {
    var allianceAndChest = initializeAlliancesAndChests();
    var alliances = allianceAndChest[0];
    var chests = allianceAndChest[1];
    for (alliance in alliances) {
        for (chest in chests) {
            $("." + alliance + "#" + chest + " .score-autonomous").text("A: " + score.treasure_autonomous[alliances[alliance] + chests[chest]]);
            $("." + alliance + "#" + chest + " .score-teleop").text("T: " + score.treasure_teleop[alliances[alliance] + chests[chest]]);
        }
    }
  }

  playSoundAtMatchStartEnd() {
    if (stage == 'Start' || stage == 'End') {
      var audio = new Audio('audio_file.mp3');
      audio.play();
    }
  }

  //END

  onLighthouseChange() {
    var timeLeft = (LighthouseTimerStore.getComputedTime() / 1000)
    var width = 100
    var color = "progress-bar-info";
    var status = "Disabled"
    if (LighthouseTimerStore.getEnabled()) {
      color = "progress-bar-success"
      status = "Available"
    }

    if (LighthouseTimerStore.getEnabled() && ! LighthouseTimerStore.getAvailable()) {
      color = "progress-bar-danger active"
      width = 100 * ((LighthouseTimerStore.getTimeLeft() / 1000) / 10)
      status = "Unavailable for " + timeLeft.toFixed(1)
    }

    this.setState({
      lighthouseTimeLeft: timeLeft.toFixed(1),
      lighthouseWidth: width,
      lighthouseColor: color,
      lightouseStatus: status
    });
  },
  componentDidMount() {
    TimerStore.on('change', this.onTimerChange);
    this.onTimerChange();

    LighthouseTimerStore.on('change', this.onLighthouseChange);
    this.onLighthouseChange();
    //setInterval(this.refresh, 80)
  },
  componentWillUnmount() {
    TimerStore.removeListener('change', this.onTimerChange);
  },
  render: function() {
        return (
        <div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <div className="row">
              <div className="col-xs-5 col-sm-4">
                <div className="panel panel-default pioneers-blue">
                  <div className="row">
                    <div className="col-md-7 col-xs-5">
                      <div className="team-0">-1 Offline</div>
                      <div className="team-1">-1 Offline</div>
                    </div>
                    <div className="col-md-1 col-md-offset-3 col-xs-1 col-xs-offset-4">
                      // <div className="score-blue text-right" style={{}}>?</div>
                      <div className="score-blue text-right" style={this.state.score-blue}>?</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-2 col-sm-4 clock">
                <div className="text-center">{this.state.timeLeft}</div>
              </div>
              <div className="col-xs-5 col-sm-4">
                <div className="panel panel-default pioneers-gold">
                  <div className="row">
                    <div className="col-md-1 col-xs-1">
                      // <div className="score-gold" style={{}}>?</div>
                      <div className="score-gold" style={this.state.score-gold}>?</div>
                    </div>
                    <div className="col-md-7  col-md-offset-3 col-xs-5 col-xs-offset-4">
                      <div className="team-2 text-right">-1 Offline</div>
                      <div className="team-3 text-right">-1 Offline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <div className="progress timer">
              <div className={"progress-bar progress-bar-striped " + this.state.color} role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} style={{width: this.state.width+"%"}}>
                <span>{this.state.stage}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-12">
            <div className="progress lighthouse-timer">
              <div className={"progress-bar progress-bar-striped " + this.state.lighthouseColor} role="progressbar" aria-valuenow={45} aria-valuemin={0} aria-valuemax={100} style={{width: this.state.lighthouseWidth+"%"}}>
                <span>{"Lighthouse Chief " + this.state.lightouseStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
       );
    }
});

export default Scoreboard;
