###-begin-{pkgname}-completion-###
if type compdef &>/dev/null; then
  _{pkgname}_completion () {
    local reply
    local si=$IFS

    IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {completer} completion -- "${words[@]}"))
    IFS=$si

    if [ "$reply" = "__tabtab_complete_files__" ]; then
      _files
    else
      _describe 'values' reply
    fi
  }
  compdef _{pkgname}_completion {pkgname}
fi
###-end-{pkgname}-completion-###
