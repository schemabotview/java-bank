#!/usr/bin/env bash
# Shoot sections or scenes at 4K and write 1920x1080 copies to the given directory, for looking at.
#   scripts/look.sh <dir> <slug or scene prefix>...
set -euo pipefail
dir=${1:?usage: scripts/look.sh <dir> <slug>...}; shift
rm -f out/shots/*.png
node scripts/shots.mjs "$@" >/dev/null
mkdir -p "$dir"
python3 - "$dir" <<'PY'
import glob, os, sys
from PIL import Image
for f in glob.glob('out/shots/*.png'):
    Image.open(f).resize((1920, 1080)).save(os.path.join(sys.argv[1], os.path.basename(f)))
PY
ls out/shots
