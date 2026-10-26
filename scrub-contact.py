"""Remove an obsolete public contact address from rendered static HTML."""
from pathlib import Path
import re
import sys

root = Path(sys.argv[1])
mailboxes = ("bonjour@fidelitiz.fr", "aide@fidelitiz.fr", "privacy@fidelitiz.fr")
contact = "https://fidelitiz-pro-beta.github.io/#contact"
script_re = re.compile(r"(<script\b[^>]*>.*?</script>)", re.I | re.S)
changed = 0
for path in root.rglob("*.html"):
    content = path.read_text(encoding="utf-8")
    if not any(mailbox in content for mailbox in mailboxes) and "Téléphone (facultatif)" not in content and "Votre messagerie s’ouvre" not in content:
        continue
    parts = script_re.split(content)
    for index in range(0, len(parts), 2):
        visible = parts[index]
        visible = visible.replace("Écrivez à privacy@fidelitiz.fr.", "Utilisez notre formulaire de contact pour exercer vos droits.")
        for mailbox in mailboxes:
            visible = re.sub(r"mailto:" + re.escape(mailbox) + r"(?:\?[^\"'\s<>]*)?", contact, visible)
            visible = visible.replace("Réessayez ou écrivez à " + mailbox + ".", "Réessayez via le formulaire de contact.")
            visible = visible.replace("Contact : " + mailbox, "Contact : formulaire de contact")
            visible = visible.replace(mailbox, "Nous contacter")
        visible = visible.replace("Écrire à l’équipe", "Contacter l’équipe")
        visible = visible.replace("Téléphone (facultatif)", "Téléphone")
        visible = visible.replace("Votre messagerie s’ouvre pour confirmer l’envoi de la demande.", "Nous vous recontacterons après réception de votre demande.")
        visible = visible.replace("Préparer ma demande", "Envoyer ma demande")
        parts[index] = visible
    updated = "".join(parts)
    if updated != content:
        path.write_text(updated, encoding="utf-8")
        changed += 1
print(f"{changed} pages corrigées")
