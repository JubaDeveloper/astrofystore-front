<script lang="ts">
  import SvgWifi from "../svg/SvgWifi.svelte";

  interface Props {
    numero: string;
    vencimento: string;
    nome: string;
  }

  let { numero, vencimento, nome }: Props = $props();
</script>

<div
  class="rounded-[16px] w-full aspect-[1.86] flex flex-col justify-between bg-strong-950 relative p-5"
>
  <div class="flex w-full justify-between items-center z-10">
    <div class="flex items-center gap-3">
      <img src="/images/chip.png" class="w-[34px]" alt="" />
      <SvgWifi />
    </div>
    <h5 class="text-[16px] text-white-0">{nome.toUpperCase()}</h5>
  </div>
  <div class="flex items-center justify-between w-full">
    <div class="flex flex-col">
      <span class="text-soft-400 text-[14px] font-normal">Número</span>
      <span class="text-disabled-300 text-[14px] font-medium">{numero}</span>
    </div>
    <div class="flex flex-col">
      <span class="text-soft-400 text-[14px] font-normal">Vencimento</span>
      <span class="text-disabled-300 text-[14px] font-medium text-right"
        >{vencimento}</span
      >
    </div>
  </div>
  <svg
    width="97"
    height="123"
    viewBox="0 0 97 123"
    fill="none"
    class="absolute z-0 right-0 top-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M152.228 -178.5H334.507C342.335 -178.5 347.219 -170.096 343.471 -163.327L343.286 -163.006L219.211 44.0791C215.423 50.401 208.594 54.2704 201.225 54.2705H18.9443C11.1168 54.2703 6.233 45.8667 9.98047 39.0977L10.166 38.7764L134.24 -168.309C138.028 -174.631 144.858 -178.5 152.228 -178.5Z"
      stroke="#222530"
    />
    <path
      d="M194.731 -110.271H377.011C384.839 -110.271 389.723 -101.867 385.975 -95.0977L385.79 -94.7764L261.715 112.309C257.927 118.631 251.098 122.5 243.729 122.5H61.4482C53.6207 122.5 48.7369 114.096 52.4844 107.327L52.6699 107.006L176.744 -100.079C180.532 -106.401 187.361 -110.271 194.731 -110.271Z"
      stroke="#222530"
    />
  </svg>
</div>
