import { SendTypingServiceParams } from "../Types";
import { IChatService } from "../interfaces";
export declare const useThrottledSendTyping: (charService: IChatService, time: number) => (params: SendTypingServiceParams) => void;
