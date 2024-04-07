import { MessageContentType } from "../enums/MessageContentType";
export interface MessageContent<MessageContentType> {
    content: unknown;
}
export interface TextContent extends MessageContent<MessageContentType.TextPlain> {
    content: string;
}
export interface MarkdownContent extends MessageContent<MessageContentType.TextMarkdown> {
    content: string;
}
export interface HtmlContent extends MessageContent<MessageContentType.TextHtml> {
    content: string;
}
export interface ImageContent extends MessageContent<MessageContentType.Image> {
    url: string;
    data: ArrayBuffer;
}
export interface GalleryItem {
    description: string;
    src: string;
}
export interface GalleryContent extends MessageContent<MessageContentType.Gallery> {
    content: GalleryItem[];
}
export interface KmlContent extends MessageContent<MessageContentType.Kml> {
    content: string;
}
export interface AttachmentContent extends MessageContent<MessageContentType.Attachment> {
    url: string;
    data: ArrayBuffer;
}
export interface AttachmentListContent extends MessageContent<MessageContentType.AttachmentList> {
    content: AttachmentContent[];
}
export interface VideoContent extends MessageContent<MessageContentType.Video> {
    url: string;
    data: ArrayBuffer;
}
export interface VCardContent extends MessageContent<MessageContentType.VCard> {
    content: unknown;
}
export interface OtherContent extends MessageContent<MessageContentType.Other> {
    content: unknown;
}
