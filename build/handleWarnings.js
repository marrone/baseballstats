function shouldIgnore(warning) {
    return warning.code === 'UNRESOLVED_IMPORT' 
        || warning.code === 'UNUSED_EXTERNAL_IMPORT'
        || warning.code === 'CIRCULAR_DEPENDENCY'
        || warning.pluginCode === 'unused-export-let';
}

function handleWarnings(warning, handler) {
    if(shouldIgnore(warning)) { return; }
    handler(warning);
}

export { shouldIgnore, handleWarnings };
