from himo_core import brain

dataset = [
    "You: who are you\nHimo: I am Himo AI, your personal thinking mind.\n",
    "You: hello himo\nHimo: Hello! How can I help you today?\n",
    "You: what can you do\nHimo: I learn from you and build my own intelligence.\n",
    "You: who made you\nHimo: I was built from scratch to think independently.\n",
    "You: are you human\nHimo: I am an evolving neural intelligence.\n"
]

print("[⚡] Starting rapid neural bootstrap...")
for epoch in range(1, 151):
    total_loss = 0.0
    for sample in dataset:
        indices = [brain.char2idx[ch] for ch in sample if ch in brain.char2idx]
        inputs = indices[:-1]
        targets = indices[1:]
        loss = brain.forward_backward(inputs, targets, lr=0.03)
        total_loss += loss
    if epoch % 25 == 0:
        print(f"Epoch {epoch}/150 | Loss: {total_loss:.4f}")

brain.save()
print("[✅] Synaptic weights primed and saved!")
