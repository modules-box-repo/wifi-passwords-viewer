#!/bin/sh

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}[1/4] Updating packages...${NC}"
apk update && echo -e "${GREEN}[1/4] Update complete${NC}"

echo -e "${BLUE}[2/4] Upgrading packages...${NC}"
apk upgrade && echo -e "${GREEN}[2/4] Upgrade complete${NC}"

echo -e "${BLUE}[3/4] Checking nodejs...${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}[3/4] nodejs is already installed${NC}"
else
    echo -e "${YELLOW}[3/4] nodejs not found${NC}"
    echo -e "${BLUE}[3/4] Installing nodejs...${NC}"
    apk add nodejs && echo -e "${GREEN}[3/4] nodejs installed successfully${NC}"
fi

echo -e "${BLUE}[4/4] Checking npm...${NC}"
if command -v npm &> /dev/null; then
    echo -e "${GREEN}[4/4] npm is already installed${NC}"
else
    echo -e "${YELLOW}[4/4] npm not found${NC}"
    echo -e "${BLUE}[4/4] Installing npm...${NC}"
    apk add npm && echo -e "${GREEN}[4/4] npm installed successfully${NC}"
fi

echo -e "${GREEN}All done.${NC}"
