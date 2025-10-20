# Master Lab - Plateforme d'Apprentissage Locale Enhance

Une plateforme d'apprentissage personnelle avancée pour organiser vos cours, ressources et notes. Fonctionne entièrement en local avec stockage CSV, upload de fichiers et notes vocales.

## 🚀 Caractéristiques

### 📚 **Gestion des Cours et Ressources**
- **Stockage Local**: Toutes vos données sont sauvegardées dans le navigateur (localStorage)
- **7 Types de Ressources**: PDF, Notes, Vidéos, Liens, Images, Fichiers uploadés, Notes vocales
- **Import/Export CSV**: Sauvegardez et importez facilement toutes vos ressources
- **Mode Hors Ligne**: Fonctionne sans connexion internet
- **Drag & Drop**: Réorganisez vos ressources facilement
- **Recherche Avancée**: Trouvez rapidement vos ressources (titre, contenu, nom de fichier)

### 🎤 **Prise de Notes Avancée**
- **Notes Vocales**: Enregistrez des notes audio directement dans l'application
- **Contrôles Complets**: Play/Pause/Stop avec chronomètre
- **Notes Texte**: Éditeur de texte intégré avec formatage
- **Historique**: Accès rapide aux dernières notes vocales

### 📁 **Gestion des Fichiers**
- **Upload de Fichiers**: Téléchargez n'importe quel type de fichier
- **Stockage Local**: Fichiers sauvegardés dans `/public/uploads/`
- **Métadonnées**: Nom, taille et type de fichier affichés
- **Support Complet**: PDF, images, documents, archives, etc.

### 📱 **Interface Responsive**
- **Menu Repliable**: Optimisé pour tablette avec menu collapsible
- **Design Adaptatif**: S'adapte automatiquement à mobile/tablet/desktop
- **Mode Compact**: Icônes seulement quand le menu est replié
- **Touch-Friendly**: Interface optimisée pour usage tactile

### 🎯 **Double Mode**
- **Mode Gestion**: Organisation complète avec drag & drop
- **Mode Étude**: Interface épurée pour la révision

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Navigateur moderne avec support Web Audio API (pour les notes vocales)

## 🛠️ Installation Locale

### 1. Cloner ou télécharger le projet

```bash
# Si vous avez le projet dans un dossier
cd /chemin/vers/votre/projet

# Ou cloner depuis un repository
git clone <url-du-repository>
cd master-lab
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Démarrer le serveur de développement

```bash
npm run dev
```

L'application sera disponible à `http://localhost:3000`

### 4. (Optionnel) Vérifier le code

```bash
npm run lint
```

## 📦 Déploiement

### Déploiement Local (Production)

```bash
# Construire l'application
npm run build

# Démarrer le serveur de production
npm start
```

### Déploiement sur GitHub Pages

#### Méthode 1: Utiliser GitHub Actions (Recommandé)

1. **Créer le fichier `.github/workflows/deploy.yml`** :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

2. **Configurer Next.js pour GitHub Pages** :

Ajouter dans `next.config.ts` :
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/master-lab/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/master-lab' : '',
}

export default nextConfig
```

3. **Mettre à jour `package.json`** :

```json
{
  "scripts": {
    "export": "next build && next export"
  }
}
```

4. **Activer GitHub Pages** :
   - Allez dans les paramètres de votre repository GitHub
   - Section "Pages" 
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` et `/ (root)`

#### Méthode 2: Déploiement Manuel

1. **Construire le projet** :
```bash
npm run build
npm run export
```

2. **Uploader le dossier `out`** sur GitHub Pages ou tout autre service d'hébergement statique.

## 🎯 Utilisation

### Première Utilisation

1. Ouvrez l'application dans votre navigateur
2. Cliquez sur "Ajouter un Cours" pour créer votre premier cours
3. Ajoutez des ressources avec les 7 types disponibles
4. Organisez vos ressources avec le drag & drop
5. Basculez entre mode Gestion et mode Étude

### Types de Ressources

- **📄 PDF/Documents**: Liens vers vos fichiers PDF ou upload direct
- **📝 Notes**: Texte et notes directement dans l'application
- **🎥 Vidéos**: Liens YouTube, Vimeo, etc.
- **🔗 Liens Web**: Articles, sites web, ressources en ligne
- **🖼️ Images**: Liens vers des images ou upload direct
- **📁 Fichiers**: Upload de n'importe quel type de fichier
- **🎤 Notes Vocales**: Enregistrement audio direct

### Notes Vocales

1. Créez une ressource de type "Note Vocale"
2. Cliquez sur le bouton micro 🎤 pour commencer l'enregistrement
3. Utilisez les contrôles Play/Pause/Stop
4. La note est automatiquement sauvegardée comme ressource audio

### Upload de Fichiers

1. Sélectionnez le type "Fichier Upload"
2. Cliquez sur la zone pour sélectionner un fichier
3. Le fichier est uploadé et stocké localement
4. Accédez-y directement depuis l'interface

### Menu Repliable (Tablette)

- **Cliquez sur `<`** pour replier le menu
- **Sur tablette**, le menu se replie automatiquement
- **Sur mobile**, utilisez le bouton ☰ en haut à gauche
- **Le menu replié** affiche seulement les icônes des cours

### Import/Export CSV

**Exporter**:
- Dans la barre latérale, cliquez sur "Exporter CSV"
- Le fichier contiendra toutes les ressources avec métadonnées complètes

**Importer**:
- Cliquez sur "Importer CSV"
- Sélectionnez un fichier CSV avec les colonnes: id, title, content, type, fileName, fileSize, createdAt, updatedAt

## 💾 Sauvegarde des Données

### LocalStorage
- Toutes vos données sont automatiquement sauvegardées dans le navigateur
- Les données persistent entre les sessions
- **Important**: Les données sont spécifiques à chaque navigateur et appareil

### Fichiers Uploadés
- Les fichiers sont stockés dans `/public/uploads/`
- En production, pensez à sauvegarder ce dossier
- Les URLs dans le CSV pointent vers ces fichiers

### Sauvegarde Manuelle
1. Exportez régulièrement vos cours en CSV
2. Gardez une copie du dossier `/public/uploads/`
3. Pour restaurer, importez simplement vos fichiers CSV

## 🔧 Personnalisation

### Changer les Couleurs
Modifiez les classes Tailwind dans le code :
- `bg-indigo-900` pour la barre latérale
- `text-indigo-600` pour les accents
- etc.

### Ajouter de Nouveaux Types de Ressources
1. Ajoutez une entrée dans `RESOURCE_TYPES`
2. Mettez à jour le type `Resource` si nécessaire
3. Ajoutez le rendu dans `renderContentPreview()`

### Responsive Design
- **Mobile**: 1 colonne, menu replié
- **Tablette**: 2 colonnes, menu repliable
- **Desktop**: 3-4 colonnes, menu déplié

## 🐛 Dépannage

### Problèmes Communs

**L'application ne se charge pas**:
- Vérifiez que Node.js est installé
- Assurez-vous d'être dans le bon dossier
- Redémarrez avec `npm run dev`

**Notes vocales ne fonctionnent pas**:
- Vérifiez les permissions du microphone
- Utilisez un navigateur moderne (Chrome, Firefox, Safari)
- HTTPS requis pour certains navigateurs

**Upload de fichiers ne fonctionne pas**:
- Vérifiez que le dossier `/public/uploads/` existe
- Vérifiez les permissions d'écriture
- Taille maximale recommandée: 50MB par fichier

**Données perdues**:
- Les données sont stockées localement, effacer le cache du navigateur les supprimera
- Exportez régulièrement en CSV pour sauvegarder

**Import CSV ne fonctionne pas**:
- Vérifiez le format du fichier CSV
- Assurez-vous que les colonnes sont correctement nommées
- Le fichier doit utiliser l'encodage UTF-8

### Développeur

Pour voir les logs de développement :
```bash
# Sur macOS/Linux
tail -f dev.log

# Sur Windows
Get-Content dev.log -Wait
```

## 📄 Format CSV Étendu

Le format CSV supporte maintenant 8 colonnes :
```csv
id,title,content,type,fileName,fileSize,createdAt,updatedAt
```

**Types possibles**: `pdf`, `note`, `video`, `link`, `image`, `file`, `audio`

## 📱 Optimisation Tablet

L'interface est spécialement optimisée pour l'usage sur tablette :
- Menu repliable pour maximiser l'espace
- Grille 2 colonnes adaptative
- Contrôles tactiles optimisés
- Notes vocales pratiques pour la révision

## 📄 Licence

Projet personnel - Utilisation libre et gratuite.

## 🤝 Contribuer

Ce projet est conçu pour un usage personnel. N'hésitez pas à le fork et l'adapter à vos besoins !

---

**Made with ❤️ pour les étudiants - Version 2.0 Enhance**