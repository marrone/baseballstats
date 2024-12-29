# usage: sed -E -n -f svelte-sort-oder.sed src/components/App.svelte
# will print "invalid" if linting validation fails, and nothing if it succeeds

# validates that the svelte contents are in the following order (each are optional)
# - script context="module"
# - script
# - html
# - style

/^[[:blank:]]*<(script|style|[a-zA-Z0-9_-]+)/{

    s/^[[:blank:]]*<(script|style|[a-zA-Z0-9_-]+)([[:blank:]]+context=['"]module)?.*$/\1\2/

    /script context=['"]module/b module
    /script/b script
    /style/b style
    b html

    :module
    x
    /^$/b ok
    b invalid
    
    :script
    x
    /(^$|module)/b ok
    b invalid

    :html
    s/^.*$/html/
    x
    /^$|script|^html$/b ok
    b invalid

    :style
    x
    /^script/b invalid
    b ok

    :invalid
    c\
invalid
    p
    q

    :ok
}
