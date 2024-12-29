# usage: sed -E -n -f svelte-export-oder.sed src/components/App.svelte
# will print "invalid" if linting validation fails, and nothing if it succeeds

# validates for scripts that exports are at the top of the script

# verify that exports come at the top of scripts
/^[[:blank:]]*<script>/,/^[[:blank:]]*<\/script>/{
    # skip blank lines and the opening script tag
    /^[[:blank:]]*(<script.*)?$/d
    # skip comment lines
    /^[[:blank:]]*(\/\/|\/\*|\*)/d

    # export lines, pull in holdspace and verify that it only contains exports or nothing
    /[[:blank:]]*export[[:blank:]]/{
        # if the export contains a function, matching where the export ends becomes too difficult, so we just give up
        /function/q

        x
        /(^[[:blank:]]*$)|([[:blank:]]*export)/b ok
        b invalid
    }

    # store current line in holdspace for next lines to verify against
    h
    b ok
    
    # fail branch
    :invalid
    c\
invalid
    p
    q

    # continue branch
    :ok
    # empty out hold space when exiting the script block
    # so that if there are following script blocks they dont 
    # start with the previous script's holdspace
    /^[[:blank:]]*<\/script>.*$/{
        s/^.*$//
        x
    }
}
