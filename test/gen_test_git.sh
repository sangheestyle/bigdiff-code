#!/bin/bash
# file: get_test_git.sh
path="$1"
cur_dir=`pwd`
cd $path

git init

touch a.txt
echo 'class Apple:' >> a.txt
git add a.txt
git commit -m "1st: commit without error"

echo 'setTag(param1, param2);' >> a.txt
git add a.txt
git commit -m "2nd: error injected"

touch b.txt
echo 'something = 1' >> b.txt
git add b.txt
git commit -m "3rd: doing something"

head -n -1 a.txt > temp.txt
mv temp.txt a.txt
echo 'nsetTag(param1, param2);' >> a.txt
git add a.txt
git commit -m "4th: fixed setTag error"

echo 'something.do();' >> a.txt
git add a.txt
git commit -m "5th: doing something"

cd $cur_dir
