export function formatMessageIime(date){
    return new Date(date).toLocaleTimeString("en-UK" , {
        hour:  "2-digit",
        minute : "2-digit",
        hour12 : false
    });
}