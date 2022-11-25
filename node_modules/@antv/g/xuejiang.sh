git filter-branch  -f --commit-filter '
        if [ "$GIT_AUTHOR_EMAIL" = "dxq613@gmail.com" ];
       then
                GIT_AUTHOR_NAME="xiaoqing.dongxq";
                GIT_AUTHOR_EMAIL="xiaoqing.dongxq@antfin.com";
                git commit-tree "$@";
        else
                git commit-tree "$@";
        fi' -- 362b30f^..362b30f HEAD 
		
