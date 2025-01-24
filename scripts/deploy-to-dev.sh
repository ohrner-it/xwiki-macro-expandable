#!/usr/bin/env bash

# Script to build the xar deployment artifact and automatically deploy it on the dev server.

# constants
PAGE_TO_DEPLOY="spaces/Macros/spaces/Expandable/pages/WebHome"

if [ "$#" -lt 2 ] || [ "$#" -gt 3 ] || [ "$#" -eq 3 ] && [ "$1" != "--netrc-file" ]; then
  echo "Script will build the XWiki xar file and deploy it on the development server"
  echo
  echo "Usage:"
  echo "  sh $0 <USERNAME>:<PASSWORD> <REST_ENDPOINT>"
  echo "  or"
  echo "  sh $0 --netrc-file <PATH_TO_NETRC_FILE> <REST_ENDPOINT>"
  exit 1
fi

if ! [ -d "./src" ]; then
   echo >&2 "Error: Please start this script from project root!"
   exit 2
fi

if [ "$#" -eq 2 ]; then
  usingNetrcFile=false
  credentials=$1
  netrcFile=""
  restEndpoint=$2
else
  usingNetrcFile=true
  credentials=""
  netrcFile=$2
  restEndpoint=$3
fi

mvnCommand=$(which mvnd)

if [ "$mvnCommand" = "" ]; then
  mvnCommand=$(which mvn)
fi

if [ "$mvnCommand" = "" ]; then
  echo >&2 "Error: You need Maven to run this script!"
  exit 2
fi

callMaven() {
  "$mvnCommand" "$@"
  exitCode=$?

  if [ "$exitCode" -ne 0 ]; then
    echo >&2 "Error: Maven call failed with exit code $exitCode"
    exit $exitCode
  fi
}

callCurl() {
  if [ "$usingNetrcFile" = "true" ]; then
    curl -netrc-file "$netrcFile" "$@"
  else
    curl -u "$credentials" "$@"
  fi

  local exitCode=$?

  if [ "$exitCode" -ne 0 ]; then
    echo >&2 "Error: cURL call failed with exit code $exitCode"
    exit $exitCode
  fi
}

pageContent=$(callCurl -s "$restEndpoint/../bin/view/Main")
formToken=$(echo "$pageContent" | grep -oP 'data-xwiki-form-token="\K[^"]+')

if [ "$formToken" = "" ]; then
  echo >&2 "Error: Could not determine form token"
  exit 2
fi

# we use mvnd as it is much faster than mnv
callMaven package package # will be called twice due to some strange maven issues

ls ./target/*.xar > /dev/null # will fail if no xar file is available
xarFilename=$(ls ./target/*.xar -t | head -1 | xargs basename)

echo
echo "Trying to deploy xar file on $restEndpoint..."

callCurl -X DELETE \
  -s \
  -H "XWiki-Form-Token: $formToken" \
  "$restEndpoint/wikis/xwiki/$PAGE_TO_DEPLOY" > /dev/null

callCurl -X POST \
  -s \
  -H "XWiki-Form-Token: $formToken" \
  -F "file=@./target/$xarFilename" \
  -F "history=RESET" \
  "$restEndpoint/wikis/xwiki" > /dev/null

echo
echo "Deployment was successful ($(date "+%Y-%m-%d %H:%M:%S"))."
