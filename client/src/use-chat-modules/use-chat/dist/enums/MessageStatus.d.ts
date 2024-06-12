/**
 * Message status flow:
 * [Pending] Sent [DeliveredToCloud] [DeliveredToDevice] [Seen]
 */
export declare enum MessageStatus {
    Pending = 0,
    Sent = 1,
    DeliveredToCloud = 2,
    DeliveredToDevice = 3,
    Seen = 4
}
