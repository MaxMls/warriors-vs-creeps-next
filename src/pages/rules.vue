<template>
	<div :class="$style.c">

		<h1>Правила</h1>
		<p>
			<a target=_blank href="https://github.com/blazzer-band/Warriors-vs-Creeps/wiki"
			>Правила прошлой версии</a><br>
			Читайте их если вам интересны все тонкие моменты, они актуальны за исключением некоторых обозначений

		</p>
		<a id="index"><h2>Указатель</h2></a>
		<div style="margin-left: 20px; margin-top: 20px;">
			<ul>
				<li>
					<a href="#map">Цель</a>
				</li>
				<li>
					<a href="#monst">Монстры</a>
				</li>
				<li>
					<a href="#term">Карты и терминал</a>
				</li>
				<li>
					<a href="#stack">Стек</a>
				</li>
				<li>
					<a href="#damage">Повреждения</a>
				</li>
				<li>
					<a href="#uti">Утилизация карт</a>
				</li>
				<li>
					<a href="#bots">Игра с ботами</a>
				</li>
			</ul>
		</div>

		<a href="#index" id="map"><h2>Цель</h2></a>

		<div style=" width: 500px">
			<GameMapComponent v-if=map3 :renderMap="map3"/>
		</div>
		<p>
			Ваша цель дотащить предмет до клетки выхода.<br/>
			Игроки могут тащить и толкать предметы и других игроков
		</p>

		<a href="#index" id="monst"><h2>Монстры</h2></a>
		<div style=" width: 500px">
			<GameMapComponent v-if=map1 :renderMap="map1"/>
		</div>
		<p>
			Места спауна монстров
		</p>

		<div style=" width: 500px">
			<GameMapComponent v-if=map2 :renderMap="map2"/>
		</div>
		<p>
			Монстры могут атаковать 4 соседние клетки,
			в данном случае предмет получит 2 повреждения, а игрок - 0
		</p>
		<p>
			Каждый ход монстры появляются на свободных клетках спауна и двигаются на одну клетку по направлению к предмету
		</p>

		<a href="#index" id="term"><h2>Карты и терминал</h2></a>
		<p>
			В начале игры создается колода из случайных карт, игроки по очереди выбирают карты и сохраняют на правой панели
		</p>
		<p>
			После того как все карты были розданы, каждому игроку нужно поместить карты в слоты на терминале или
			утилизировать их, набор карт в слоте называется <b>стек</b>
		</p>
		<p>
			После того, как Командные карты программируются в Командную строку, их место и порядок становятся
			фиксированными. Их можно только перепрограммировать (изменить порядок) путем утилизации электрических или
			компьютерных карт во время фазы выбора карт.
		</p>
		<p>
			<router-link to="/cards">Вы можете посмотреть все карты на этой странице</router-link>
		</p>
		<a href="#index" id='stack'><h2>Стек</h2></a>

		<div style="display: grid; grid-auto-columns: 220px; grid-gap: 20px; grid-auto-flow: column">
			<div>
				<CardComponent :stack="[1,]"/>
			</div>
			<div>
				<CardComponent :stack="[0,2]"/>
			</div>
			<div>
				<CardComponent :stack="[0,1,0]"/>
			</div>
		</div>
		<p></p>
		<p>
			Если в слоте Командной строки лежит более одной Командной карты, то это стек.
		</p>
		<p>
			Стек может содержать до 3 Командных карт при условии, что все они одного цвета / стихии. Увеличение размера
			стека усиливает эффект Командной карты. На каждой Командной карте указаны ее эффекты для различных уровней Силы
			(стек из 1, 2, 3 карт). Когда карта помещена в стек, вы не можете выбрать меньший уровень силы.
		</p>
		<p>
			В подфазе ходов игроков в каждой слоте будет выполнятся только та карта, которая находится на топе (т.е.
			наверху) стека. Остальные же карты в стеке игнорируются.
		</p>
		<p>
			Если четвертая Командная карта той же стихии играется в стек, самая нижняя Командная карта сбрасывается.
			Стек
			по-прежнему содержит 3 карты, и Сила равна 3, но верхняя карта становится новой активной картой.
		</p>
		<p>
			Командная карта другой стихии (другого цвета) может быть сыграна в имеющийся стек, но тогда весь старый стек
			должен быть сброшен, так что на его месте остается только одна новая Командная карта.
		</p>
		<a id="damage" href="#index">
			<h2 style="display: flex; align-items: center; gap:10px">
				Повреждения
				<SvgIcon :class="$style.icon" name="types-warning"/>
			</h2>
		</a>
		<div style="display: grid; grid-auto-columns: 220px; grid-gap: 20px; grid-auto-flow: column">
			<div>
				<CardComponent :stack="[1,13]"/>
			</div>
		</div>
		<p></p>
		<p>
			Получаемое повреждение задается Картами повреждений, которые тянутся из Колоды повреждений (выбираются
			случайным образом). Повреждение может затруднить управление Воином и усложнить достижение вашей цели! Но – не
			волнуйтесь. Вы не можете умереть!
		</p>
		<a id="uti" href="#index">
			<h2 style="display: flex; align-items: center; gap:10px">
				Утилизация карт
				<SvgIcon :class="$style.icon" name="cran"/>
			</h2>
		</a>
		<p>
			Во время выбора карт взятые вами Командные карты могут быть тут же утилизированы (сброшены) вместо
			программирования в Командную строку.
		</p>
		<p>
			Вы можете утилизировать только карты из взятых вами при выборе карт. Карты, уже помещенные в слоты,
			утилизировать нельзя.
		</p>
		<ul>
			<li>
				<SvgIcon :class="$style.icon" name="trash"/>
				<p>
					Удаляет карту без эффектов
				</p>
			</li>
			<li>
				<SvgIcon :class="$style.icon" name="cranMove"/>
				<p>
					Только для
					<SvgIcon :class="$style.icon" name="types-crown"/>
					и
					<SvgIcon style="--icon-color: #6E286B" :class="$style.icon" name="types-fire"/>
					Удаляет карту и позволяет удалить повреждение для одного слота

				</p>
			</li>
			<li>
				<SvgIcon :class="$style.icon" name="fix"/>
				<p>
					Только для
					<SvgIcon :class="$style.icon" name="types-lightning"/>
					и
					<SvgIcon :class="$style.icon" name="types-mech"/>
					Удаляет карту и позволяет поменять местами 2 неповреждённый слота или переместить стек на пустой слот

				</p>
			</li>
		</ul>
		<a id="bots" href="#index"><h2>Боты</h2></a>
		<p>
			Действия ботов ничем не отличаются от действий обычных игроков
		</p>
		<p>
			При игре с ботами не требуется подключение к сети, можно играть даже если сервер в данный момент недоступен.
		</p>
		<p>
			Боты могут усложнить прохождение, так как они действуют по своему усмотрению, и их план действий может
			отличатся от вашего
		</p>

	</div>
</template>

<script lang=ts>
import {defineComponent, onMounted, ref} from "vue";
import GameMapComponent from "../components/GameMapComponent.vue";
import {GameMap} from "../engine/game-map";
import {IRenderMap} from "../engine/renders/vue-render";
import {Unit} from "../engine/unit";
import {EDirection, EHighlight, EUnitType} from "../engine/types";
import SvgIcon from "../components/SvgIcon.vue";
import CardComponent from "../components/CardComponent.vue";

export default defineComponent({
	components: {CardComponent, SvgIcon, GameMapComponent},
	name: "game",
	setup() {
		let keyGen = 0
		const map1 = ref<IRenderMap | null>(null)
		const map2 = ref<IRenderMap | null>(null)
		const map3 = ref<IRenderMap | null>(null)


		onMounted(() => {
			{
				const map: any = {}
				map.gameMap = new GameMap([
					[2, 0, 0, 0, 0, 0],
					[0, 2, 0, 2, 2, 0],
					[0, 0, 0, 0, 0, 0],
				])
				map.cellsToSelect = new Map()
				map.cellsDirection = new Map()
				map.onCellClick = () => {}
				map1.value = map
			}

			{
				const map: any = {}
				map.gameMap = new GameMap([
					[2, 0, 0, 0, 0, 0],
					[0, 2, 1, 2, 2, 0],
					[0, 0, 3, 0, 0, 0],
				])
				const hero = new Unit(EUnitType.Hero)
				// @ts-ignore
				map.units = new Map([
					...map.gameMap.getAllCellsByType(2).map(cell => {
						return [new Unit(EUnitType.Creep), {
							state: 'idle',
							skin: 'greenSlime',
							cell, key: ++keyGen
						}]
					}),
					...map.gameMap.getAllCellsByType(1).map(cell => {
						return [new Unit(EUnitType.Bomb), {
							state: 'idle',
							skin: 'cake',
							cell, key: ++keyGen
						}]
					}),
					...map.gameMap.getAllCellsByType(3).map(cell => {
						return [hero, {
							state: 'idle',
							skin: 'ame',
							cell, key: ++keyGen
						}]
					})
				])
				map.cellsToSelect = new Map()
				map.cellsDirection = new Map([[hero, EDirection._270]])
				map.onCellClick = () => {}

				map2.value = map
			}
			{
				const map: any = {}


				map.gameMap = new GameMap([
					[0, 0, 0, 0, 0, 0],
					[0, 1, 1, 3, 0, 0],
					[0, 0, 0, 0, 0, 0],
				])
				let unit = new Unit(EUnitType.Hero)
				let cake = new Unit(EUnitType.Bomb)

				const units = [
					(cell) => [cake, {
						state: 'idle',
						skin: 'cake',
						cell, key: ++keyGen
					}],
					(cell) => {
						return [unit, {
							state: 'idle',
							skin: 'ame',
							cell, key: ++keyGen
						}]
					},
				]

				map.units = new Map([
					...map.gameMap.getAllCellsByType(1).map(cell => {
						// @ts-ignore
						return units.pop()(cell)
					})
				])

				setTimeout(() => {
					// @ts-ignore
					map3.value.cellsToSelect.set(map.gameMap?.getCell(3, 1),
						 {highlight: EHighlight.Move, ind: 0}
					)
				}, 0)

				map.cellsToSelect = new Map()
				map.cellsDirection = new Map([[unit, EDirection._90]])
				map.onCellClick = () => {
					{
						const unitInstance = map3.value!.units.get(unit)!
						unitInstance.cell = map.gameMap?.getCell(2, 1)
						unitInstance.state = 'walk'
						setTimeout(() => {
							unitInstance.state = 'idle'
						}, 500)
					}
					{
						const unitInstance = map3.value!.units.get(cake)!
						unitInstance.cell = map.gameMap?.getCell(3, 1)
						unitInstance.state = 'walk'
						setTimeout(() => {
							unitInstance.state = 'idle'
						}, 500)
					}
					map3.value!.cellsToSelect.clear()
				}
				map3.value = map
			}

		})

		return {
			map1, map2, map3
		}
	}
})
</script>

<style module lang=scss>
.c {
	--icon-color: black;
	font-size: 20px;
	width: 100%;
	padding: 20px;
	max-width: 1200px;
	margin: auto;

	* {

		line-height: 150%;
	}


	p {
		margin-top: 10px;
		margin-bottom: 30px;
	}

	h2 {
		margin-top: 30px;
		margin-bottom: 10px;
	}

	a {
		color: #1D4FD0;
		border-bottom: 1px solid #1D4FD0;
	}

	a[id] {
		color: #333;

		&[href] {
			h2 {
				display: flex;
				align-items: center;
				border-bottom: none;

				&:before {
					font-size: 25px;
					margin-right: 10px;
					display: block;
					content: '☝';
				}
			}


		}
	}


	li {
		margin-bottom: 20px;
		gap: 10px;
	}
}

.icon {
	--icon-color: black;
	width: 30px;
	height: 30px;

}

</style>
