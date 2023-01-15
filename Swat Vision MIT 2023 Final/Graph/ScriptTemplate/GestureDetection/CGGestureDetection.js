const { BaseNode } = require('./BaseNode');
const Amaz = effect.Amaz;

const { BEMessage, BEState } = require('./BEMessage');
const BEMsg = BEMessage.Gesture;

class CGGestureDetection extends BaseNode {
  constructor() {
    super();
    this.gestureDetected = false;
    this.handIndexMap = {
      'Hand 0': 0,
      'Hand 1': 1,
      Either: -1,
    };
    this.handActionMap = {
      'Backhand 3-Finger Pointing Up': Amaz.HandAction.THREE,
      '4-Finger Pointing Up': Amaz.HandAction.FOUR,
      Fist: Amaz.HandAction.FIST,
      'Open Palm': Amaz.HandAction.HAND_OPEN,
      '"I Love You"': Amaz.HandAction.ROCK,
      Horns: Amaz.HandAction.ROCK2,
      'Index Pointing up': Amaz.HandAction.INDEX_FINGER_UP,
      Victory: Amaz.HandAction.VICTORY,
      'Thumb up': Amaz.HandAction.THUMB_UP,
      'Hand Heart(Thumb Up)': Amaz.HandAction.HEART_A,
      'Hand Heart(Thumb Down)': Amaz.HandAction.HEART_B,
      'Open Fist Heart': Amaz.HandAction.HEART_C,
      'Finger Heart': Amaz.HandAction.HEART_D,
      'Index Pointing': Amaz.HandAction.PISTOL,
      '2-Finger Pointing': Amaz.HandAction.PISTOL2,
      '3-Finger Pointing Up': Amaz.HandAction.SWEAR,
      OK: Amaz.HandAction.OK,
      '"Call Me"': Amaz.HandAction.PHONECALL,
      'V(Thumb and Index)': Amaz.HandAction.BIG_V,
      'Touching Palms': Amaz.HandAction.NAMASTE,
      'Kung Fu Salute(Fist Uncovered)': Amaz.HandAction.BEG,
      '"Pray"': Amaz.HandAction.PRAY,
      'Palm up': Amaz.HandAction.PLAM_UP,
      'Kung Fu Salute (Fist Covered)': Amaz.HandAction.THANKS,
      'Wrist V': Amaz.HandAction.HOLDFACE,
      Salute: Amaz.HandAction.SALUTE,
      'Palm To Front': Amaz.HandAction.SPREAD,
      'Pinched Fingers': Amaz.HandAction.CABBAGE,
      'Thumb down': Amaz.HandAction.THUMB_DOWN,
      'Index and Middle Pointing Up': Amaz.HandAction.DOUBLE_FINGER_UP,
    };
    this.handAction = {
      'Backhand 3-Finger Pointing Up': BEMsg.action.Three.id,
      '4-Finger Pointing Up': BEMsg.action.Four.id,
      Fist: BEMsg.action.Fist.id,
      'Open Palm': BEMsg.action.HandOpen.id,
      '"I Love You"': BEMsg.action.Rock.id,
      Horns: BEMsg.action.Rock2.id,
      'Index Pointing up': BEMsg.action.IndexFingerUp.id,
      Victory: BEMsg.action.Victory.id,
      'Thumb up': BEMsg.action.ThumbUp.id,
      'Hand Heart(Thumb Up)': BEMsg.action.HeartA.id,
      'Hand Heart(Thumb Down)': BEMsg.action.HeartB.id,
      'Open Fist Heart': BEMsg.action.HeartC.id,
      'Finger Heart': BEMsg.action.HeartD.id,
      'Index Pointing': BEMsg.action.Pistol.id,
      '2-Finger Pointing': BEMsg.action.Pistol2.id,
      '3-Finger Pointing Up': BEMsg.action.Swear.id,
      OK: BEMsg.action.OK.id,
      '"Call Me"': BEMsg.action.PhoneCall.id,
      'V(Thumb and Index)': BEMsg.action.BigV.id,
      'Touching Palms': BEMsg.action.Namaste.id,
      'Kung Fu Salute(Fist Uncovered)': BEMsg.action.Beg.id,
      '"Pray"': BEMsg.action.Pray.id,
      'Palm up': BEMsg.action.PalmUp.id,
      'Kung Fu Salute (Fist Covered)': BEMsg.action.Thanks.id,
      'Wrist V': BEMsg.action.HoldFace.id,
      Salute: BEMsg.action.Salute.id,
      'Palm To Front': BEMsg.action.Spread.id,
      'Pinched Fingers': BEMsg.action.Cabbage.id,
      'Thumb down': BEMsg.action.ThumbDown.id,
      'Index and Middle Pointing Up': BEMsg.action.DoubleFingerUp.id,
    };
    this.twoHandGesture = false;
    this.indexMap = {};
    this.lastAction = BEState.None.key;
  }

  updateMap() {
    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    const count = algResult.getHandCount();
    if (count === 0) {
      this.indexMap[0] = undefined;
      this.indexMap[1] = undefined;
    } else if (count === 1) {
      this.indexMap[0] = 0;
      this.indexMap[1] = undefined;
    } else {
      const hand0 = algResult.getHandInfo(0);
      const hand1 = algResult.getHandInfo(1);
      const id0 = hand0.ID;
      const id1 = hand1.ID;
      if (id0 < id1) {
        this.indexMap[0] = 0;
        this.indexMap[1] = 1;
      } else {
        this.indexMap[0] = 1;
        this.indexMap[1] = 0;
      }
    }
  }

  onUpdate(sys, dt) {
    this.updateMap();

    const whichHand = this.inputs[0]();
    const gesture = this.inputs[1]();

    const algMgr = Amaz.AmazingManager.getSingleton('Algorithm');
    const algResult = algMgr.getAEAlgorithmResult();

    if (algResult && whichHand !== null && gesture !== null) {
      const index = this.handIndexMap[whichHand];
      const action = this.handActionMap[gesture];

      if (index === undefined || action === undefined) {
        return;
      }

      let hasAction = false;
      if (index === -1) {
        for (let i = 0; i < 2; ++i) {
          const actualIndex = this.indexMap[i];
          if (actualIndex !== undefined) {
            const hand = algResult.getHandInfo(actualIndex);
            if (hand) {
              hasAction = hasAction || hand.action === action;
            }
          }
        }
      } else {
        const actualIndex = this.indexMap[index];
        if (actualIndex !== undefined) {
          const hand = algResult.getHandInfo(actualIndex);
          if (hand) {
            hasAction = hand.action === action;
          }
        }
      }

      if (hasAction && !this.gestureDetected) {
        if (this.nexts[0]) {
          this.nexts[0]();
        }
        if (sys.scene && this.lastAction !== BEState.Begin.key) {
          this.lastAction = BEState.Begin.key;
          sys.scene.postMessage(BEMsg.msgId, this.handAction[gesture], BEState.Begin.id, '');
        }
      }
      if (hasAction) {
        if (this.nexts[1]) {
          this.nexts[1]();
        }
        if (sys.scene && this.lastAction !== BEState.Stay.key) {
          this.lastAction = BEState.Stay.key;
          sys.scene.postMessage(BEMsg.msgId, this.handAction[gesture], BEState.Stay.id, '');
        }
      }
      if (this.gestureDetected && !hasAction) {
        if (this.nexts[2]) {
          this.nexts[2]();
        }
        if (sys.scene && this.lastAction !== BEState.End.key) {
          this.lastAction = BEState.End.key;
          sys.scene.postMessage(BEMsg.msgId, this.handAction[gesture], BEState.End.id, '');
        }
      }
      if (!hasAction) {
        if (this.nexts[3]) {
          this.nexts[3]();
        }
        if (sys.scene && this.lastAction !== BEState.None.key) {
          this.lastAction = BEState.None.key;
          sys.scene.postMessage(BEMsg.msgId, this.handAction[gesture], BEState.None.id, '');
        }
      }
      this.gestureDetected = hasAction;
    }
  }
}

exports.CGGestureDetection = CGGestureDetection;
