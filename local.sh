#!/bin/bash

# Build application aws-sam and launch locally
sam build && sam local start-api --env-vars env.json --skip-pull-image
