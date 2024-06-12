"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageStatus = void 0;
/**
 * Message status flow:
 * [Pending] Sent [DeliveredToCloud] [DeliveredToDevice] [Seen]
 */
var MessageStatus;
(function (MessageStatus) {
    MessageStatus[MessageStatus["Pending"] = 0] = "Pending";
    MessageStatus[MessageStatus["Sent"] = 1] = "Sent";
    MessageStatus[MessageStatus["DeliveredToCloud"] = 2] = "DeliveredToCloud";
    MessageStatus[MessageStatus["DeliveredToDevice"] = 3] = "DeliveredToDevice";
    MessageStatus[MessageStatus["Seen"] = 4] = "Seen";
})(MessageStatus = exports.MessageStatus || (exports.MessageStatus = {}));
//# sourceMappingURL=MessageStatus.js.map