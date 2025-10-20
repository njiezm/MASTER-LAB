# Guide de Déploiement GitHub Pages

## Étape 1: Préparer le Repository

1. **Créez un nouveau repository sur GitHub** :
   - Allez sur https://github.com/new
   - Nommez-le `master-lab` (ou le nom que vous voulez)
   - Choisissez Public ou Private
   - Ne cochez pas "Add a README file"

2. **Connectez votre projet local** :
```bash
# Dans votre dossier de projet
git init
git add .
git commit -m "Initial commit - Master Lab Platform"

# Connectez à votre repository (remplacez USERNAME par votre nom d'utilisateur)
git remote add origin https://github.com/USERNAME/master-lab.git
git branch -M main
git push -u origin main
```

## Étape 2: Configurer pour GitHub Pages

1. **Mettez à jour `next.config.ts`** :
   - Décommentez les lignes 31-32 si votre repository s'appelle `master-lab`
   - Si vous avez un autre nom, adaptez le chemin :
   ```typescript
   assetPrefix: process.env.NODE_ENV === 'production' ? '/VOTRE-NOM-REPO/' : '',
   basePath: process.env.NODE_ENV === 'production' ? '/VOTRE-NOM-REPO' : '',
   ```

2. **Vérifiez que le workflow est bien configuré** :
   - Le fichier `.github/workflows/deploy.yml` doit exister
   - Il est déjà configuré pour se déclencher sur chaque push vers `main`

## Étape 3: Activer GitHub Pages

1. **Allez dans les paramètres du repository** :
   - Cliquez sur "Settings" dans votre repository
   - Allez dans la section "Pages" dans le menu de gauche

2. **Configurez la source** :
   - Source: "Deploy from a branch"
   - Branch: `gh-pages`
   - Folder: `/ (root)`

3. **Sauvegardez** - GitHub affichera un message comme "Your site is ready to be published at https://USERNAME.github.io/master-lab/"

## Étape 4: Déployer

1. **Pushez vos changements** :
```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

2. **Attendez le déploiement** :
   - Allez dans l'onglet "Actions" de votre repository
   - Vous verrez le workflow "Deploy to GitHub Pages" s'exécuter
   - Une fois terminé, votre site sera disponible

## Étape 5: Vérifiez le déploiement

Votre site sera disponible à : `https://VOTRE-NOM-UTILISATEUR.github.io/VOTRE-REPO/`

## Dépannage

### Le site ne s'affiche pas (404)
- Vérifiez que GitHub Pages est activé dans les settings
- Attendez quelques minutes après le déploiement
- Vérifiez le `basePath` dans `next.config.ts`

### Les ressources ne se chargent pas
- Vérifiez le `assetPrefix` dans `next.config.ts`
- Assurez-vous que les chemins sont corrects

### Le workflow échoue
- Allez dans l'onglet "Actions" pour voir les erreurs
- Vérifiez que le fichier `deploy.yml` est correct

### Problèmes avec les images
- Les images sont désactivées (`unoptimized: true`) pour GitHub Pages
- Utilisez des URLs absolues pour les images externes

## Alternative: Déploiement Manuel

Si le workflow automatique ne fonctionne pas, vous pouvez déployer manuellement :

1. **Construisez le projet** :
```bash
npm run build
npm run export
```

2. **Uploadez le dossier `out`** :
   - Renommez `out` en `docs` (optionnel)
   - Uploadez-le à la racine de votre repository
   - Configurez GitHub Pages pour utiliser la branche `main` et le dossier `docs`

## Mises à jour

Pour chaque mise à jour de votre plateforme :
1. Faites vos changements
2. Committez et pushez :
```bash
git add .
git commit -m "Description des changements"
git push origin main
```

Le déploiement se fera automatiquement !