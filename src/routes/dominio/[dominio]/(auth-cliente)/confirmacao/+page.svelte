<script lang="ts">
    import SvgConfirmacao from "$components/assets/svg/SvgConfirmacao.svelte";
</script>

<div class="flex flex-col items-center justify-center w-full h-full">
    <div class="flex flex-col items-center justify-center max-w-[500px]">
        <SvgConfirmacao/>
        <div class="flex flex-col text-center justify-center w-full">
            <p class="text-strong-950 font-medium text-24">Nova senha solicitada!</p>
            <p class="text-16 font-medium text-sub-600">Caso tenha uma conta cadastrada, você vai receber em segundos um link de redefinição de senha no e-mail email@email.com.br </p>
        </div>
    </div>
</div>