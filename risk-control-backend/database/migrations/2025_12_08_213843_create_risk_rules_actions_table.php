<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('risk_rule_actions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('risk_rule_id')->constrained()->onDelete('cascade');
            $table->foreignId('risk_action_id')->constrained()->onDelete('cascade');
            $table->integer('order')->default(0);
            $table->timestamps();
            $table->unique(['risk_rule_id', 'risk_action_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('risk_rules_actions');
    }
};
