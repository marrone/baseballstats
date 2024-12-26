function handleWarnings(warning, handler) {
    if(warning.code === 'UNRESOLVED_IMPORT' 
    || warning.code === 'UNUSED_EXTERNAL_IMPORT'
    || warning.code === 'CIRCULAR_DEPENDENCY'
    || warning.pluginCode === 'unused-export-let') { 
        return; 
    }
    handler(warning);
}

export { handleWarnings };
