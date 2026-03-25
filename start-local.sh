#!/bin/bash
# ═══════════════════════════════════════════════════
# Garden Faery Books — Local Server
# ═══════════════════════════════════════════════════
# Run this on your Mac to start the app locally.
# Access from your iPhone on the same WiFi.
#
# No internet or cloud needed — 100% local.
# ═══════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

PORT=8080

# Get local IP for iPhone access
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "localhost")

echo ""
echo "🌱 Garden Faery Books — Local Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 On your Mac:     http://localhost:$PORT"
echo "📱 On your iPhone:  http://$LOCAL_IP:$PORT"
echo "   (must be on same WiFi)"
echo ""
echo "Press Ctrl+C to stop the server."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Open in default browser on Mac
open "http://localhost:$PORT" 2>/dev/null &

# Start server
python3 -m http.server $PORT --bind 0.0.0.0
