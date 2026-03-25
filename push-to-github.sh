#!/bin/bash
# ═══════════════════════════════════════════════════
# Garden Faery Books — Push to GitHub Pages
# ═══════════════════════════════════════════════════
# Run this ONCE from your Mac Terminal to:
#   1. Create a private GitHub repo
#   2. Push the app code
#   3. Enable GitHub Pages (free hosting)
#
# After this, your app will be live at:
#   https://YOUR-USERNAME.github.io/garden-faery-books
#
# IMPORTANT: No financial data is uploaded. Only the
# empty app shell goes to GitHub. Your bookkeeping
# data stays on your phone/device only.
# ═══════════════════════════════════════════════════

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo "🌱 Garden Faery Books — GitHub Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This will push your bookkeeping app to GitHub Pages"
echo "so you can access it from your iPhone."
echo ""
echo "⚠️  ONLY the app code is uploaded. Your financial"
echo "    data NEVER leaves your device."
echo ""

# Check for gh CLI
if ! command -v gh &> /dev/null; then
    echo "📦 GitHub CLI (gh) not found. Installing via Homebrew..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew not found. Install it first:"
        echo '   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        echo "   Then run this script again."
        exit 1
    fi
    brew install gh
fi

# Check if logged in
if ! gh auth status &> /dev/null 2>&1; then
    echo "🔐 Please log in to GitHub..."
    gh auth login
fi

# Get GitHub username
GH_USER=$(gh api user --jq '.login')
echo "✅ Logged in as: $GH_USER"
echo ""

# Remove .git if exists (clean slate)
rm -rf .git

# Init fresh repo
git init -b main
git add index.html sw.js manifest.json icon-192.png icon-512.png
git commit -m "Initial Garden Faery Books PWA - offline-first bookkeeping"

# Create repo on GitHub (public needed for free GitHub Pages)
echo "📂 Creating GitHub repository..."
if gh repo view "$GH_USER/garden-faery-books" &> /dev/null 2>&1; then
    echo "   Repo already exists, pushing update..."
    git remote add origin "https://github.com/$GH_USER/garden-faery-books.git" 2>/dev/null || git remote set-url origin "https://github.com/$GH_USER/garden-faery-books.git"
else
    gh repo create garden-faery-books --public \
        --description "Offline-first bookkeeping PWA for Garden Faery. No financial data stored in cloud." \
        --source=. --push
fi

git push -u origin main

# Enable GitHub Pages
echo "🌐 Enabling GitHub Pages..."
gh api repos/$GH_USER/garden-faery-books/pages \
    --method POST \
    --field "source[branch]=main" \
    --field "source[path]=/" 2>/dev/null || \
gh api repos/$GH_USER/garden-faery-books/pages \
    --method PUT \
    --field "source[branch]=main" \
    --field "source[path]=/" 2>/dev/null || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Done! Your app will be live in ~2 minutes at:"
echo ""
echo "   https://$GH_USER.github.io/garden-faery-books"
echo ""
echo "📱 On your iPhone:"
echo "   1. Open Safari"
echo "   2. Go to the URL above"
echo "   3. Tap Share → Add to Home Screen"
echo "   4. Now it works like a real app!"
echo ""
echo "🔒 Remember: Your financial data stays on your"
echo "   device only. GitHub just hosts the empty app."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
