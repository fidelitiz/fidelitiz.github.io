"""Remove the unpublished mailbox from the exported GitHub Pages site."""
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
mailbox = "bonjour@fidelitiz.fr"
contact = "https://fidelitiz-pro-beta.github.io/#contact"
changed = 0
for path in root.rglob("*"):
    if not path.is_file() or path.suffix not in {".html", ".js", ".json"}:
        continue
    content = path.read_text(encoding="utf-8")
    if mailbox not in content and "Téléphone (facultatif)" not in content and "Votre messagerie s’ouvre" not in content:
        continue
    updated = content
    updated = updated.replace(',"email":"' + mailbox + '"', '')
    updated = updated.replace(',\\"email\\":\\"' + mailbox + '\\"', '')
    updated = re.sub(r"mailto:" + re.escape(mailbox) + r"(?:\?[^\"'\s<>\\]*)?", contact, updated)
    updated = updated.replace("Réessayez ou écrivez à " + mailbox + ".", "Réessayez via le formulaire de contact.")
    updated = updated.replace("Contact : " + mailbox, "Contact : formulaire de contact")
    updated = updated.replace(mailbox, "Nous contacter")
    updated = updated.replace("Écrire à l’équipe", "Contacter l’équipe")
    updated = updated.replace("Téléphone (facultatif)", "Téléphone")
    updated = updated.replace("Votre messagerie s’ouvre pour confirmer l’envoi de la demande.", "Nous vous recontacterons après réception de votre demande.")
    updated = updated.replace("Préparer ma demande", "Envoyer ma demande")
    if updated != content:
        path.write_text(updated, encoding="utf-8")
        changed += 1
print(f"{changed} fichiers corrigés")
