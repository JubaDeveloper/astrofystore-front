<script lang="ts">
    import handleDate from "$lib/sanitizers/time";
    import { blur, slide } from "svelte/transition";
    import { onMount } from "svelte";
    import SelectBlock from "../logic/SelectBlock.svelte";
    import Botao from "../buttons/Botao.svelte";
    import SvgCaret from "$components/assets/svg/SvgCaret.svelte";
    import { portal } from "$lib/actions/portal.svelte";
    import FocusBlock from "../logic/FocusBlock.svelte";
    import sanitizar from "$lib/sanitizers/sanitizer";
  import PopUp from "../modals/PopUp.svelte";
 

    type RangeType={
        start:Date | null,
        end:Date | null
    }

    interface Props{
      isVisible:boolean;
      range:RangeType  | undefined  | null  
      onlyOneDay:boolean
      onSelecionar?:(v:RangeType)=>void
    }

    let {isVisible = $bindable(),range = $bindable(),onlyOneDay,onSelecionar}:Props = $props()


    const now = new Date()

    let year:number = $state(now.getFullYear())
    let month:number = $state(now.getMonth())

    let selectYear:boolean = $state(false)
    let selectMonth:boolean = $state(false)
    let selectSecondary:boolean = $state(false)

    let inputYear:string = $state("")

    let yearSecondary:number = $state(now.getFullYear())
    let monthSecondary:number = $state(now.getMonth())

    
    let selectedStartDate = $state<null | Date>(null);
    let selectedEndDate = $state<null | Date>(null);

    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
    
    
    const yearsOptions:{label:string,value:number}[] = []

    for(let i=0;i<=100;i++){
      yearsOptions.push({
        value: now.getFullYear()-i,
        label:(now.getFullYear()-i).toString()
      })
    }
    
    function selectDate(day:number,monthCustom?:number,yearCustom?:number) {
      let newDate:Date;
      if(monthCustom!=null && yearCustom!=null) newDate=new Date(yearCustom,monthCustom,day);
      else newDate=new Date(year,month,day);

      if(onlyOneDay==true){
        selectedStartDate = newDate;
        selectedEndDate = newDate;  
      }
      else if (selectedStartDate && newDate.getTime() === selectedStartDate.getTime()) {
        selectedStartDate = null;
        selectedEndDate = null;
      } 
      else if (!selectedStartDate) {
        selectedStartDate = newDate;
        selectedEndDate = newDate;
      } 
      else if (!selectedEndDate || newDate < selectedStartDate) {
        selectedStartDate = newDate;
        selectedEndDate = newDate;
      } else {
        selectedEndDate = newDate;
      }
      
      range = { start: selectedStartDate, end: selectedEndDate }
    }

    let customPeriodos = $derived([
    {
      label: "Hoje",
      onClick: () => {
        if (!range) return;
        const now = new Date();
        range.start = now;
        selectedStartDate = range.start;
        range.end = now;
        selectedEndDate = range.end;
      },
      selected: range && range.start && range.end && range.start.getTime() === range.end.getTime() && range.end.getTime() === new Date().getTime()
    },
    {
      label: "Esta semana",
      onClick: () => {
        if (!range) return;
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Início da semana (domingo)
        range.start = startOfWeek;
        selectedStartDate = range.start;
        range.end = new Date();
        selectedEndDate = range.end;
      },
      selected: range && range.start && range.end && 
        range.start.getDay() === 0 && // Começa no domingo
        range.end.getTime() === new Date().getTime() // Termina hoje
    },
    {
      label: "Este mês",
      onClick: () => {
        if (!range) return;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        range.start = startOfMonth;
        selectedStartDate = range.start;
        range.end = new Date();
        selectedEndDate = range.end;
      },
      selected: range && range.start && range.end && 
        range.start.getDate() === 1 && // Começa no dia 1 do mês
        range.start.getMonth() === range.end.getMonth() && // Mesmo mês
        range.end.getTime() === new Date().getTime() // Termina hoje
    },
    {
      label: "Este ano",
      onClick: () => {
        if (!range) return;
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1); // 1º de janeiro
        range.start = startOfYear;
        selectedStartDate = range.start;
        range.end = new Date();
        selectedEndDate = range.end;
      },
      selected: range && range.start && range.end && 
        range.start.getMonth() === 0 && // Janeiro
        range.start.getDate() === 1 && // Dia 1
        range.end.getTime() === new Date().getTime() // Termina hoje
    },
]);


    function isInRange(day: number, start: Date | null, end: Date | null, year: number, month: number) {
      const date = new Date(year, month, day);
      const startDate = start ? new Date(start.getFullYear(), start.getMonth(), start.getDate()) : null;
      const endDate = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null;
      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      if (startDate && currentDate.getTime() === startDate.getTime() || endDate && currentDate.getTime() === endDate.getTime()) {
        return 'selected';
      }
      else if (startDate && endDate && currentDate > startDate && currentDate < endDate) {
        return 'range';
      } else {
        return '';
      }
    }

    function prevMonth(secondary:boolean){
      if(secondary===true){

        monthSecondary - 1 < 0 ? yearSecondary = yearSecondary - 1 : yearSecondary
        monthSecondary = (monthSecondary - 1 + 12) % 12
        return
      }
      month - 1 < 0 ? year = year - 1 : year
      month = (month - 1 + 12) % 12
    }
    function nextMonth(secondary:boolean){
      if(secondary===true){
        monthSecondary + 1 > 11 ? yearSecondary = yearSecondary + 1 : yearSecondary
        monthSecondary = (monthSecondary + 1) % 12
        return
      }
      month + 1 > 11 ? year = year + 1 : year
      month = (month + 1) % 12
    }

    function colorDays(day:number,currentYear:number,currentMonth:number,enumRange:string){

      let isMain=false
      let isEnd=false
      if(enumRange==="selected"){
        isMain=true
      }
      if(!isInRange(day+2, selectedStartDate, selectedEndDate, currentYear, currentMonth)){
        isEnd=true
      }
      if(range && range.start === range.end){
        return "rounded-[8px]"
      }

      if(isMain && !isEnd){
        return "[&:nth-child(7n)]:rounded-[8px] not-[&:nth-child(7n)]:rounded-l-[8px]"
      }
      if(isMain && isEnd){
        return "rounded-r-[8px]"
      }
        return "[&:nth-child(7n)]:rounded-r-[8px] [&:nth-child(7n+1)]:rounded-l-[8px]"
    }

    function processDays(currentYear:number,currentMonth:number):{daysInMonth:number,indexStart:number,firstDayDate:Date,firstDayName:string}{
        const namesEnglish = [
            { original: 'Sun', ptbr: 'Dom' },
            { original: 'Mon', ptbr: 'Seg' },
            { original: 'Tue', ptbr: 'Ter' },
            { original: 'Wed', ptbr: 'Qua' },
            { original: 'Thu', ptbr: 'Qui' },
            { original: 'Fri', ptbr: 'Sex' },
            { original: 'Sat', ptbr: 'Sab' }
        ];
        const firstDayName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { weekday: 'short' })
        return{
          daysInMonth: new Date(currentYear, currentMonth + 1, 0).getDate(),
          firstDayDate: new Date(currentYear, currentMonth, 1),
          firstDayName: firstDayName,
          indexStart: namesEnglish.findIndex(day => day.original === firstDayName),
        }       

    }

    function resetAll(){
      range = {
        start:null,
        end:null
      }
      selectedStartDate = null
      selectedEndDate = null
      selectYear=false
      selectMonth=false
    }

    onMount(()=>{
      if(range && range.start!==null){
        selectedStartDate = range.start;
        selectedEndDate = range.end
      }
    })

</script>



<div class="flex flex-col xl:flex-row xl:gap-6 text-sub-600 justify-between" in:slide>

  {#if onlyOneDay===false}
    <div class="flex-col flex  gap-4 w-full xl:pb-3 pb-1 p-3 px-3">
        <div class="flex flex-wrap xl:flex-col gap-2 w-full">
          {#each customPeriodos as periodo}
            <button 
            class="text-[12px] text-left xl:w-full font-medium p-1 px-2 rounded-[8px]
            text-sub-600 data-[selected]:bg-weak-50 data-[selected]:text-strong-950
            not-data-[selected]:hover:bg-weak-50 not-data-[selected]:hover:text-strong-950" 
            onclick={periodo.onClick}
            data-selected={periodo.selected ? true : null}>
              {periodo.label}
            </button>
          {/each}
      </div>
    </div>
  {/if}

  <div class="flex flex-col">
    
    {@render fixedSelect(selectSecondary)}

    <div class="flex xl:flex-row flex-col">
      {@render wholeCalendar(false)}
      {#if !onlyOneDay}
        {@render wholeCalendar(true)}
      {/if}
    </div>
  
     {#if range && range.start && range.end}
      <div class=" text-[14px] p-3 px-3  {!onlyOneDay && "border-l"} border-soft-200 w-full items-center  
      {onlyOneDay ? "flex" : "flex justify-between flex-wrap gap-x-24 gap-y-4"} ">
        {#if !onlyOneDay}
            <p class="whitespace-nowrap">
              <b>Periodo: </b>
              <span>{handleDate.formatDate(range.start)} - {handleDate.formatDate(range.end)}</span>
            </p>
        {/if}
        <div class="grid grid-cols-2 w-full gap-4">
          <Botao tema="gray-transparent" onClick={resetAll}>
              Limpar
          </Botao>
          <Botao tema="primary" onClick={()=>{
            if(onSelecionar && range){
              return onSelecionar(range)
            }
          }}>
            Selecionar
          </Botao>  
        </div>
      </div>
    {/if}
  </div>
  

</div>

{#snippet btnArrow(arial:string,onClick:VoidFunction,cssArrow:string)}
    <button class="bg-white-0 hover:bg-primary-base rounded-[6px] aspect-square  shrink-0 flex justify-center 
    items-center shadow-sm group w-[20px]"
    aria-label={arial} onclick={onClick}>
      <SvgCaret props={{
        class: "fill-sub-600 w-2 group-hover:fill-white "+cssArrow,
        width:18,
        height:18
      }}/>
    </button>
{/snippet}

{#snippet selects(secondary:boolean)}
  {@const currentYear = secondary ? yearSecondary : year}
  {@const currentMonth = secondary ? monthSecondary : month}

  {@render btnArrow("Mês anterior",()=>prevMonth(secondary),"rotate-[90deg]")}
  
  <div class="flex gap-1 items-center">


    <div class="hidden xl:flex justify-center group cursor-pointer relative">
   
        {monthNames[currentMonth]} 
   
        <div class="not-group-hover:opacity-0 not-group-hover:max-h-0 origin-top not-group-hover:pointer-events-none flex flex-col max-h-[120px] 
        absolute top-[100%] rounded-[6px] border border-soft-200 overflow-y-auto" >
            {#each monthNames as m,i}
              <button class="p-2 bg-white-0  text-strong-950 hover:bg-strong-400" onclick={()=>{
                if(secondary) return monthSecondary = i
                return month = i
              }}>
                {m}              
              </button>
            {/each}
        </div>
    
    </div>

    <button class=" xl:hidden flex justify-center group cursor-pointer relative" onclick={()=>{
      selectSecondary=secondary
      selectMonth=true
    }}>
      {monthNames[currentMonth]}   
    </button>






    <div class="hidden xl:flex justify-center group cursor-pointer relative">
      {currentYear}
      <div class="not-group-hover:opacity-0 not-group-hover:max-h-0 origin-top not-group-hover:pointer-events-none flex flex-col max-h-[120px] 
      absolute top-[100%] rounded-[6px] border border-soft-200 overflow-y-auto ">
          {#each yearsOptions as y,i}
            <button class="p-2 px-4 bg-white-0  text-strong-950 hover:bg-strong-400" onclick={()=>{
               if(secondary) return yearSecondary = y.value
               return year = y.value
            }}>
              {y.label}              
            </button>
          {/each}
      </div>
    </div>

    <button class=" xl:hidden flex justify-center group cursor-pointer relative" onclick={()=>{
      selectSecondary=secondary
      selectYear=true
      setTimeout(()=>{
        document.getElementById("focusInputCalendar")?.focus()

      },300)
    }}>
      {currentYear}  
    </button>

  
  </div>

  {@render btnArrow("Proximo mês",()=>nextMonth(secondary),"rotate-[-90deg]")}


{/snippet}

{#snippet wholeCalendar(secondary:boolean)}
{@const currentYear = secondary ? yearSecondary : year}
{@const currentMonth = secondary ? monthSecondary : month}
{@const {indexStart,daysInMonth} = processDays(currentYear,currentMonth)}
<div class="flex flex-col gap-2 relative {!onlyOneDay && "border"} border-r-0 border-t-0 border-soft-200 p-4">

  <div class="flex gap-2 select-none justify-between text-[14px]  w-full bg-weak-50 px-[6px] p-[6px] rounded-[8px]">
    
      {@render selects(secondary)}

  </div>

  <div class="flex flex-col p-1  whitespace-nowrap text-[14px] xl:w-[368px]">
      <div class="font-medium grid mb-2 grid-cols-7">
        {#each weekDays as day}
          <div class="text-center ">{day}</div>
        {/each}
      </div>
      <div class="grid grid-cols-7 gap-y-1 shrink-0">
        {#each {length: indexStart} as _,  day}
          <div class="pointer-events-none">
            
          </div>
        {/each}
        {#each {length: daysInMonth} as _,  day}
          {@const enumRange = isInRange(day+1, selectedStartDate, selectedEndDate, currentYear, currentMonth)}
          <button 
          class="[&:nth-child(7n)]:rounded-r-[8px] font-normal
          data-[selected]:bg-primary-base data-[selected]:text-static-white 
          data-[range]:bg-primary-alpha-10 data-[range]:text-primary-base 
          hover:bg-weak-50 hover:text-strong-950 flex-shrink-0 flex justify-center items-center aspect-square
          {colorDays(day,currentYear,currentMonth,enumRange)}" 
          onclick={() => selectDate(day+1,currentMonth,currentYear)}
          data-selected={enumRange==="selected" ? true : null} data-range={enumRange==="range" ? true : null}>
            {day+1}
          </button>
        {/each}
      </div>
  </div>
</div>

{/snippet}



{#snippet fixedSelect(secondary:boolean)}

  {@const currentYear = secondary ? yearSecondary : year}
  {@const currentMonth = secondary ? monthSecondary : month}
        <PopUp bind:open={selectMonth} target="#dataRange">
          
          <div class="flex flex-col items-center justify-between gap-1 text-[22px] w-[200px] text-strong-950/80 bg-white-0">
              <button onclick={()=>prevMonth(secondary)} aria-label="Mês anterior">
                  <SvgCaret
                      props={{
                        width:24,
                        height:24,
                        class:"rotate-[180deg] scale-x-[1.3]"
                      }}
                  />
              </button>
              {monthNames[currentMonth]}
              <button onclick={()=>nextMonth(secondary)} aria-label="Proximo mês">
                <SvgCaret
                    props={{
                      width:24,
                      height:24,
                      class:"scale-x-[1.3]"
                    }}
                />
            </button>

          </div>

        </PopUp>
        <PopUp bind:open={selectYear}  target="#dataRange">
          
       
            <div class="flex flex-col  gap-2 items-center justify-center text-[18px]">
                <b class="text-strong-950">Digite o ano:</b> 
                <input type="text" bind:value={inputYear} id="focusInputCalendar" class=" text-strong-950/80 text-center outline-none w-full" placeholder="Ex: 1994" oninput={(e)=>{
                    let val:string = (e.target as HTMLInputElement).value;       
                    val = val.slice(0,4);             
                    (e.target as HTMLInputElement).value = sanitizar.numero(val)
                }} onkeydown={(e)=>{
                  if(e.key==="Enter"){
                    const val:string = (e.target as HTMLInputElement).value;
                    if(val.length<4) return
                    selectYear=false
                    if(secondary){
                      yearSecondary = parseInt(val.slice(0,4));
                      return
                    }
                    year = parseInt(val.slice(0,4));
                  }
                }}/>
                <div class="grid grid-cols-2 w-full gap-4">
                  <Botao tema="gray-transparent"  onClick={resetAll}>
                    Cancelar
                  </Botao>
                  <Botao tema="primary" onClick={()=>{
                      if(inputYear.length<4) return
                      selectYear=false
                      if(secondary){
                        yearSecondary = parseInt(inputYear.slice(0,4));
                        return
                      }
                      year = parseInt(inputYear.slice(0,4));
                      
                  }}>
                    Selecionar
                  </Botao>  
                </div>
            </div>

        </PopUp>
    


{/snippet}