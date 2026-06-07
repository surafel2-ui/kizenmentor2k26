rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Global Safety Net
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Global ID check
    function isValidId(id) { 
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$'); 
    }
    
    // Helpers
    function incoming() { 
      return request.resource.data; 
    }
    function existing() { 
      return resource.data; 
    }
    
    // 2. Photos Collection
    match /photos/{photoId} {
      allow get, list: if true;
      
      function isValidPhoto(data) {
        return data.id is string && data.id.size() <= 128
          && data.url is string && data.url.size() <= 12582912
          && data.caption is string && data.caption.size() <= 5000
          && data.studentNames is string && data.studentNames.size() <= 2000
          && (data.uploadedBy == 'Teferi' || data.uploadedBy == 'Sinen')
          && data.timestamp is string && data.timestamp.size() <= 100
          && data.likes is int && data.likes >= 0;
      }
      
      allow create: if isValidId(photoId) && isValidPhoto(incoming());
      
      allow update: if isValidPhoto(incoming()) && (
        // Action: Increment Likes
        (incoming().diff(existing()).affectedKeys().hasOnly(['likes']) && incoming().likes == existing().likes + 1)
        ||
        // Action: Text content or general editing
        (incoming().id == existing().id && incoming().uploadedBy == existing().uploadedBy)
      );
      
      allow delete: if true;
    }
    
    // 3. Guestbook Messages Collection
    match /messages/{messageId} {
      allow get, list: if true;
      
      function isValidMessage(data) {
        return data.id is string && data.id.size() <= 128
          && data.name is string && data.name.size() <= 200
          && data.content is string && data.content.size() <= 5000
          && data.timestamp is string && data.timestamp.size() <= 100;
      }
      
      allow create: if isValidId(messageId) && isValidMessage(incoming());
      allow delete: if true;
    }
  }
}
