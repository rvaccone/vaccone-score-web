<!-- Header -->
<div align="center">
    <h1>Vaccone Score Web</h1>
    <p>
        A thoughtful interface for tracking matches and viewing player analytics
        <br />
        <a href="#installation">Installation</a>
        ·
        <a href="#related-repositories">Related Repositories</a>
    </p>
</div>

## Installation

1. Install [Bun](https://bun.sh/)

```bash
# macOS and Linux
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

2. Clone the repository

```bash
git clone https://github.com/rvaccone/vaccone-score-web.git
cd vaccone-score-web
```

3. Install dependencies

```bash
bun install
```

4. Add a `.env.local` file to the project root with the URL of the analysis service

```bash
touch .env.local
echo "NEXT_PUBLIC_ANALYSIS_URL=http://localhost:8000" >> .env.local
```

5. Start the development server

```bash
bun dev
```

6. View the local development server at `http://localhost:3000`

> [!IMPORTANT]
> You need to have the analysis service running locally for analytics to work properly. You can learn how to install and run the service [here](https://github.com/rvaccone/vaccone-score-analysis).

## Related Repositories

- [vaccone-score-analysis](https://github.com/rvaccone/vaccone-score-analysis)
