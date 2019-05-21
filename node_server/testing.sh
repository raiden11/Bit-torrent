transmission-remote -t all -i > status.txt
grep Downloaded status.txt > down_status.txt
grep Uploaded status.txt > up_status.txt