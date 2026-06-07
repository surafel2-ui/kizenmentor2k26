{
  "entities": {
    "Photo": {
      "title": "Photo",
      "description": "A yearbook graduation photo with captions and tags",
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "url": { "type": "string" },
        "caption": { "type": "string" },
        "studentNames": { "type": "string" },
        "uploadedBy": { "type": "string", "enum": ["Teferi", "Sinen"] },
        "timestamp": { "type": "string", "format": "date-time" },
        "tags": { "type": "array" },
        "likes": { "type": "integer" }
      },
      "required": ["id", "url", "uploadedBy", "timestamp", "likes"]
    },
    "GuestMessage": {
      "title": "GuestMessage",
      "description": "A guestbook message written by a visitor",
      "type": "object",
      "properties": {
        "id": { "type": "string" },
        "name": { "type": "string" },
        "content": { "type": "string" },
        "timestamp": { "type": "string", "format": "date-time" },
        "role": { "type": "string" }
      },
      "required": ["id", "name", "content", "timestamp"]
    }
  },
  "firestore": {
    "photos": {
      "schema": "Photo",
      "description": "Collection of uploaded yearbook photos"
    },
    "messages": {
      "schema": "GuestMessage",
      "description": "Collection of guestbook visitor messages"
    }
  }
}
