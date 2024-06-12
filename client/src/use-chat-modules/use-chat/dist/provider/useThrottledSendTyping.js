"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThrottledSendTyping = void 0;
const react_1 = require("react");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const useThrottledSendTyping = (charService, time) => (0, react_1.useMemo)(() => {
    const subject = new rxjs_1.Subject();
    subject
        .pipe((0, operators_1.throttleTime)(time, rxjs_1.asyncScheduler, { leading: true, trailing: true }))
        .subscribe((params) => {
        charService.sendTyping(params);
    });
    return (params) => subject.next(params);
}, [time]);
exports.useThrottledSendTyping = useThrottledSendTyping;
//# sourceMappingURL=useThrottledSendTyping.js.map