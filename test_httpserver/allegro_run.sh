#!/bin/bash


mitmdump --set upstream-cert=false --set server_replay_kill_extra=true --set server_replay_nopop=true  -S save.mitm
