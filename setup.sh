#!/bin/sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[1/3] Updating packages...${NC}"
apk update && echo -e "${GREEN}[1/3] Update complete${NC}"

echo -e "${BLUE}[2/3] Upgrading packages...${NC}"
apk upgrade && echo -e "${GREEN}[2/3] Upgrade complete${NC}"

echo -e "${BLUE}[3/3] Checking nodejs...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}[3/3] nodejs is already installed${NC}"
else
    echo -e "${YELLOW}[3/3] nodejs not found${NC}"
    echo -e "${BLUE}[3/3] Installing nodejs...${NC}"
    apk add nodejs && echo -e "${GREEN}[3/3] nodejs installed successfully${NC}"
fi

echo -e "${GREEN}All done.${NC}"