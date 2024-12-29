/**
 * This module exports some utility functions used throughout the app
 */

function formatDate(timestamp:number):string {
    return (new Date(timestamp)).toLocaleDateString("en-US", {
        weekday:'short', 
        year:'numeric', 
        month:'short', 
        day:'numeric'
    });
}

export { formatDate };
