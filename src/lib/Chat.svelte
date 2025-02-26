<script>
	import { onMount } from 'svelte';

	let open = false;
	let messages = [{ sender: 'bot', text: 'Hello! Ask me anything.' }];
	let input = '';

	async function sendMessage() {
		if (!input.trim()) return;
		messages = [...messages, { sender: 'user', text: input }];
		let response = await fetch('/api/chat/', {
			method: 'POST',
			body: JSON.stringify({ message: input })
		});
		let { reply } = await response.json();
		messages = [...messages, { sender: 'bot', text: reply }];
		input = '';
	}
</script>

<div
	class="fixed right-4 bottom-4"
	ondblclick={() => (open ? (open = false) : null)}
	role="button"
	tabindex="0"
>
	<button
		class="rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg"
		onclick={() => (open = !open)}
	>
		💬
	</button>

	{#if open}
		<div class="fixed right-4 bottom-4 w-80 rounded-xl bg-gray-900 p-4 text-white shadow-xl">
			<div class="h-64 overflow-y-auto p-2">
				{#each messages as msg}
					<div class={msg.sender === 'user' ? 'text-right' : 'text-left'}>
						<p class="inline-block rounded-md bg-gray-700 px-2 py-1">{msg.text}</p>
					</div>
				{/each}
			</div>
			<div class="flex gap-2">
				<input
					type="text"
					class="flex-1 rounded-lg bg-gray-800 p-2 text-white"
					bind:value={input}
					onkeyup={(e) => e.key === 'Enter' && sendMessage()}
				/>
				<button class="rounded-lg bg-blue-500 px-3 py-2" onclick={sendMessage}>➡️</button>
			</div>
		</div>
	{/if}
</div>
