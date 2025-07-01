export default function Loading() {
	return (
		<div className="absolute inset-0 z-50 flex items-center justify-center bg-base-100/80">
			<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
		</div>
	);
}
